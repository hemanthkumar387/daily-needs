import express from "express";
import DailyItem from "../models/DailyItem.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* GET all items */
router.get("/", protect, async (req, res) => {
    const items = await DailyItem.find({ userId: req.user.id });
    res.json(items);
});

/* ADD item */
router.post("/", protect, async (req, res) => {
    const { name, price } = req.body;

    const exists = await DailyItem.findOne({
        userId: req.user.id,
        name: { $regex: `^${name}$`, $options: "i" },
    });


    if (exists) {
        return res.status(400).json({ message: "Item already exists" });
    }

    const item = await DailyItem.create({
        userId: req.user.id,
        name,
        price,
    });

    res.status(201).json(item);
});

/* UPDATE item */
router.put("/:id", protect, async (req, res) => {
    const { name, price } = req.body;

    const updated = await DailyItem.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { name, price },
        { new: true }
    );

    res.json(updated);
});

/* DELETE item */
router.delete("/:id", protect, async (req, res) => {
    await DailyItem.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
    });

    res.json({ message: "Item deleted" });
});

export default router;
