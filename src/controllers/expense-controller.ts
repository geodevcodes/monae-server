import asyncHandler from "express-async-handler";
import ExpenseModel from "../models/expense-model";

// -------------------- CREATE EXPENSE --------------------
export const createExpense = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;
  const { budgetId, expenseAmount } = req.body;

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
});

// -------------------- DELETE EXPENSE --------------------
export const deleteExpense = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const expense = await ExpenseModel.findById(id);
  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  await ExpenseModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
    data: [],
  });
});

// -------------------- GET ALL EXPENSES --------------------
export const getExpenses = asyncHandler(async (req: any, res: any) => {
  const { userId } = req;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const expenses = await ExpenseModel.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: expenses,
    nextPage: expenses.length === limit ? page + 1 : null,
  });
});
