import BudgetModel from "../models/budget-model";
import asyncHandler from "express-async-handler";
import ExpenseModel from "../models/expense-model";

// Create a Budget
export const createBudget = asyncHandler(async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const {
      budgetName,
      budgetAmount,
      budgetDuration,
      budgetDate,
      budgetCategories,
    } = req.body;

    const checkBudgetName = await BudgetModel.findOne({ budgetName, userId });
    if (checkBudgetName)
      return res.status(401).json({ message: "Budget Name already exists" });

    const newBudget = await BudgetModel.create({
      userId,
      budgetName,
      budgetAmount,
      budgetDuration,
      budgetDate,
      budgetCategories,
    });

    return res.status(200).json({
      success: true,
      message: "Budget created successfully",
      data: newBudget,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// get all Budgets
export const getBudgets = asyncHandler(async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (pageNumber - 1) * limit;

    const search = req.query.search || "";
    const filter: any = { userId };
    if (search) filter.budgetName = { $regex: search, $options: "i" };

    // Fetch paginated budgets
    const budgets = await BudgetModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBudgets = await BudgetModel.countDocuments(filter);
    const endCursor = skip + budgets.length;
    const hasNextPage = endCursor < totalBudgets;

    // Fetch all budgets for this user to compute totals
    const allBudgets = await BudgetModel.find({ userId });
    const allBudgetIds = allBudgets.map((b) => b._id);

    // Aggregate expenses for all budgets
    const expensesAggregation = await ExpenseModel.aggregate([
      { $match: { budgetId: { $in: allBudgetIds } } },
      { $group: { _id: "$budgetId", totalSpent: { $sum: "$expenseAmount" } } },
    ]);

    const expensesMap = new Map(
      expensesAggregation.map((e) => [e._id.toString(), e.totalSpent])
    );

    // Add progress and remainingBudget to each paginated budget
    const budgetsWithProgress = budgets.map((budget) => {
      const totalExpenses = expensesMap.get(budget._id.toString()) || 0;
      const progress = Math.min(
        (totalExpenses / budget.budgetAmount) * 100,
        100
      );
      const remainingBudget = budget.budgetAmount - totalExpenses;

      return {
        ...budget.toObject(),
        totalExpenses,
        remainingBudget,
        budgetProgress: progress,
      };
    });

    // Calculate overall totals
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
  } catch (error: any) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a single Budget
export const getBudget = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // 1. Find budget
    const budget = await BudgetModel.findById(id);
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "Budget not found" });
    }

    // 2. Calculate total expenses for this budget
    const expensesAggregation = await ExpenseModel.aggregate([
      { $match: { budgetId: budget._id } },
      { $group: { _id: null, totalSpent: { $sum: "$expenseAmount" } } },
    ]);

    const totalExpenses = expensesAggregation[0]?.totalSpent || 0;

    // 3. Calculate remaining budget and progress
    const remainingBudget = budget.budgetAmount - totalExpenses;
    const budgetProgress = Math.min(
      (totalExpenses / budget.budgetAmount) * 100,
      100
    );

    // 4. Return combined data
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  Update a Budget
export const updateBudget = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Find budget by ID
    const budget = await BudgetModel.findById(id);
    if (!budget) {
      res.status(404);
      throw new Error(`Cannot find budget with ID ${id}`);
    }

    const data = { ...req.body };

    // Update the budget
    const updatedBudget = await BudgetModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Budget Updated Successfully",
      data: updatedBudget,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

//  delete a Budget
export const deleteBudget = asyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Find the budget by ID
    const budget = await BudgetModel.findById(id);

    if (!budget) {
      res.status(404);
      throw new Error(`cannot find any budget with ID ${id}`);
    }
    // Delete the budget from the database
    await BudgetModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Budget Deleted Successfully",
      data: [],
    });
  } catch (error: any) {
    res.status(500);
    throw new Error(error.message);
  }
});
