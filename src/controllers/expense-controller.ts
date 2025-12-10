import asyncHandler from "express-async-handler";
import ExpenseModel from "../models/expense-model";

// Create an Expense
export const createExpense = asyncHandler(async (req: any, res: any) => {
  try {
    const { userId } = req;
    const { budgetId, expenseAmount } = req.body;

    // 1. Create expense
    const expense = await ExpenseModel.create({
      userId,
      budgetId,
      expenseAmount,
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an Expense
export const deleteExpense = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const expense = await ExpenseModel.findById(id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    await ExpenseModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Expense deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all Expenses
export const getExpenses = asyncHandler(async (req: any, res: any) => {
  try {
    const { userId } = req;
    const { page = 1, limit = 10 } = req.query;

    const expenses = await ExpenseModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: expenses,
      nextPage: expenses.length === Number(limit) ? Number(page) + 1 : null,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
