import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      //   type: [String],
      //   default: [],
      //   required: true,
    },
    budgetProgress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const BudgetModel = mongoose.model("budget", budgetSchema);

export default BudgetModel;
