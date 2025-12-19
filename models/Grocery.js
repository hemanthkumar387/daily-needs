import mongoose from "mongoose";

const groceryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    teluguName: String,
    quantity: String,
    unit: String,
    category: String,
    bought: {
      type: Boolean,
      default: false, // 🔥 NEW
    },

    boughtAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GroceryItem", groceryItemSchema);
