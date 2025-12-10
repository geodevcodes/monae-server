import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    expenseAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const ExpenseModel = mongoose.model("Expense", expenseSchema);

export default ExpenseModel;
