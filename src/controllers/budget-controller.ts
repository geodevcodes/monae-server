import BudgetModel from "../models/budget-model";
import asyncHandler from "express-async-handler";
import ExpenseModel from "../models/expense-model";

// -------------------- CREATE BUDGET --------------------
export const createBudget = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;
  const {
    budgetName,
    budgetAmount,
    budgetDuration,
    budgetDate,
    budgetCategories,
  } = req.body;

  const checkBudgetName = await BudgetModel.findOne({ budgetName, userId });
  if (checkBudgetName) {
    res.status(400);
    throw new Error("Budget Name already exists");
  }

  const newBudget = await BudgetModel.create({
    userId,
    budgetName,
    budgetAmount,
    budgetDuration,
    budgetDate,
    budgetCategories,
  });

  res.status(200).json({
    success: true,
    message: "Budget created successfully",
    data: newBudget,
  });
});

// -------------------- GET ALL BUDGETS --------------------
export const getBudgets = asyncHandler(async (req: any, res: any) => {
  const userId = req.userId;
  const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (pageNumber - 1) * limit;

  const search = req.query.search || "";
  const filter: any = { userId };
  if (search) filter.budgetName = { $regex: search, $options: "i" };

  const budgets = await BudgetModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalBudgets = await BudgetModel.countDocuments(filter);
  const endCursor = skip + budgets.length;
  const hasNextPage = endCursor < totalBudgets;

  const allBudgets = await BudgetModel.find({ userId });
  const allBudgetIds = allBudgets.map((b) => b._id);

  const expensesAggregation = await ExpenseModel.aggregate([
    { $match: { budgetId: { $in: allBudgetIds } } },
    { $group: { _id: "$budgetId", totalSpent: { $sum: "$expenseAmount" } } },
  ]);

  const expensesMap = new Map(
    expensesAggregation.map((e) => [e._id.toString(), e.totalSpent])
  );

  const budgetsWithProgress = budgets.map((budget) => {
    const totalExpenses = expensesMap.get(budget._id.toString()) || 0;
    const progress = Math.min((totalExpenses / budget.budgetAmount) * 100, 100);
    const remainingBudget = budget.budgetAmount - totalExpenses;

    return {
      ...budget.toObject(),
      totalExpenses,
      remainingBudget,
      budgetProgress: Number(progress.toFixed(2)),
    };
  });

  const totalBudgetAmount = allBudgets.reduce(
    (acc, b) => acc + b.budgetAmount,
    0
  );
  const totalSpentAmount = allBudgets.reduce(
    (acc, b) => acc + (expensesMap.get(b._id.toString()) || 0),
    0
  );
  const overallProgress = totalBudgetAmount
    ? (totalSpentAmount / totalBudgetAmount) * 100
    : 0;
  const overallRemainingBudget = totalBudgetAmount - totalSpentAmount;

  const meta = {
    totalBudgets,
    totalBudgetAmount,
    totalItems: totalBudgets,
    limit,
    pageNumber,
    totalPages: Math.ceil(totalBudgets / limit),
    hasNextPage,
    endCursor,
    totalSpentAmount,
    overallRemainingBudget,
    overallProgress: Number(overallProgress.toFixed(2)),
  };

  res.status(200).json({
    success: true,
    message: "Budgets Fetched Successfully",
    meta,
    data: budgetsWithProgress,
  });
});

// -------------------- GET SINGLE BUDGET --------------------
export const getBudget = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const budget = await BudgetModel.findById(id);
  if (!budget) {
    res.status(404);
    throw new Error("Budget not found");
  }

  const expensesAggregation = await ExpenseModel.aggregate([
    { $match: { budgetId: budget._id } },
    { $group: { _id: null, totalSpent: { $sum: "$expenseAmount" } } },
  ]);

  const totalExpenses = expensesAggregation[0]?.totalSpent || 0;
  const remainingBudget = budget.budgetAmount - totalExpenses;
  const budgetProgress = Math.min(
    (totalExpenses / budget.budgetAmount) * 100,
    100
  );

  res.status(200).json({
    success: true,
    message: "Budget Fetched Successfully",
    data: {
      ...budget.toObject(),
      totalExpenses,
      remainingBudget,
      budgetProgress,
    },
  });
});

// -------------------- UPDATE BUDGET --------------------
export const updateBudget = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const budget = await BudgetModel.findById(id);

  if (!budget) {
    res.status(404);
    throw new Error(`Cannot find budget with ID ${id}`);
  }

  const updatedBudget = await BudgetModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Budget Updated Successfully",
    data: updatedBudget,
  });
});

// -------------------- DELETE BUDGET --------------------
export const deleteBudget = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const budget = await BudgetModel.findById(id);

  if (!budget) {
    res.status(404);
    throw new Error(`Cannot find any budget with ID ${id}`);
  }

  await BudgetModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Budget Deleted Successfully",
    data: [],
  });
});
