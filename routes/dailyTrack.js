import express from "express";
import DailyTrack from "../models/DailyTrack.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* Get all daily data */
router.get("/", protect, async (req, res) => {
  const records = await DailyTrack.find({ userId: req.user.id });
  res.json(records);
});

/* Save / Update a day */
router.post("/", protect, async (req, res) => {
  const { date, data } = req.body;

  const record = await DailyTrack.findOneAndUpdate(
    { userId: req.user.id, date },
    { data },
    { upsert: true, new: true }
  );

  res.json(record);
});

/* Delete item from all days */
router.delete("/item/:name", protect, async (req, res) => {
  const { name } = req.params;

  const records = await DailyTrack.find({ userId: req.user.id });

  for (let r of records) {
    if (r.data[name] !== undefined) {
      delete r.data[name];
      await r.save();
    }
  }

  res.json({ message: "Item removed from all days" });
});

export default router;
