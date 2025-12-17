import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, "supersecretkey");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
