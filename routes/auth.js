import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = "supersecretkey";

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        return res.status(409).json({
            message: "Username or Email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        username,
        email,
        password: hashedPassword
    });

    res.status(201).json({ message: "Registered successfully" });
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({
        $or: [
            { email: email },
            { username: email } // 👈 same input
        ]
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false // true in production
    });

    res.json({ message: "Login successful" });
});

router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      username: decoded.username
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

export default router;
