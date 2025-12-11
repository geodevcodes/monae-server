import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    budgetName: {
      type: String,
      required: true,
      trim: true,
    },
    budgetAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    budgetDuration: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      required: true,
    },
    budgetDate: {
      type: Date,
      required: true,
    },
    budgetCategories: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const BudgetModel = mongoose.model("budget", budgetSchema);

export default BudgetModel;
