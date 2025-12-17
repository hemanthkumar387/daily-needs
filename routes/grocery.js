// routes/groceries.js
import express from "express";
import GroceryItem from "../models/Grocery.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* GET user's groceries */
router.get("/", protect, async (req, res) => {
  const items = await GroceryItem.find({ userId: req.user.id });
  res.json(items);
});

/* ADD */
router.post("/", protect, async (req, res) => {
  const item = await GroceryItem.create({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).json(item);
});

/* UPDATE */
router.put("/:id", protect, async (req, res) => {
  const updated = await GroceryItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* DELETE */
router.delete("/:id", protect, async (req, res) => {
  await GroceryItem.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  res.json({ message: "Deleted" });
});

export default router;
