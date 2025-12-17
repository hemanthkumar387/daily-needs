import mongoose from "mongoose";

const dailyTrackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    data: {
      type: Object, // { Water: true, Exercise: false }
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("DailyTrack", dailyTrackSchema);
