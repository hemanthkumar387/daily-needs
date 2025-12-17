import express from "express";
import Expense from "../models/Expense.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* CREATE */
router.post("/", protect, async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json(expense);
});

/* READ (all expenses of logged-in user) */
router.get("/", protect, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id });
  res.json(expenses);
});

/* UPDATE */
router.put("/:id", protect, async (req, res) => {
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* DELETE */
router.delete("/:id", protect, async (req, res) => {
  await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  res.json({ message: "Deleted" });
});

export default router;
