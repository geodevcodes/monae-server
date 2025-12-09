import BudgetModel from "../models/budget-model";
import asyncHandler from "express-async-handler";

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
      budgetProgress: 0,
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

    if (search) {
      filter.budgetName = { $regex: search, $options: "i" };
    }

    const totalBudgets = await BudgetModel.countDocuments();
    const budgets = await BudgetModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalItems = await BudgetModel.countDocuments();
    const endCursor = skip + budgets.length;
    const hasNextPage = endCursor < totalItems;

    const meta = {
      totalBudgets,
      totalItems,
      limit,
      pageNumber,
      totalPages: Math.ceil(totalBudgets / limit),
      hasNextPage,
      endCursor,
    };

    res.status(200).json({
      success: true,
      message: "Budgets Fetched Successfully",
      meta,
      data: budgets,
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
    const budget = await BudgetModel.findById(id);

    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: "Budget not found" });
    }
    res.status(200).json({
      success: true,
      message: "Budget Fetched Successfully",
      data: budget,
    });
  } catch (error: any) {
    res.status(500);
    throw new Error(error.message);
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
