import {
  createExpense,
  deleteExpense,
  getExpenses,
} from "../controllers/expense-controller";
import { verifyToken } from "../middlewares/verify-token";

const router = require("express").Router();

// Create a expense
router.post("/create-expense", verifyToken, createExpense);

//fetch all expenses
router.get("/", verifyToken, getExpenses);

//Delete a budget
router.delete("/:id", verifyToken, deleteExpense);

export default router;
