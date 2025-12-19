// routes/groceries.js
import express from "express";
import GroceryItem from "../models/Grocery.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ================= GET USER GROCERIES ================= */
router.get("/", protect, async (req, res) => {
  try {
    const items = await GroceryItem.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    console.error("Get groceries error:", err);
    res.status(500).json({ message: "Failed to fetch groceries" });
  }
});

/* ================= ADD GROCERY ================= */
router.post("/", protect, async (req, res) => {
  try {
    const item = await GroceryItem.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error("Add grocery error:", err);
    res.status(500).json({ message: "Failed to add item" });
  }
});

/* ================= UPDATE GROCERY (SAFE) ================= */
router.put("/:id", protect, async (req, res) => {
  try {
    const { quantity, bought, boughtAt } = req.body;

    const updateData = {};
    if (quantity !== undefined) updateData.quantity = quantity;
    if (bought !== undefined) updateData.bought = bought;
    if (boughtAt !== undefined) updateData.boughtAt = boughtAt;

    const updatedItem = await GroceryItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    console.error("Update grocery error:", err);
    res.status(500).json({ message: "Failed to update item" });
  }
});

/* ================= DELETE GROCERY ================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    await GroceryItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete grocery error:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
});

export default router;
