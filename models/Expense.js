import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: String,
  amount: Number,
  category: String,
  date: String,
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
