import {
  createBudget,
  deleteBudget,
  getBudget,
  getBudgets,
  updateBudget,
} from "../controllers/budget-controller";
import { verifyToken } from "../middlewares/verify-token";


const router = require("express").Router();

// Create a budget
router.post("/create-budget", verifyToken, createBudget);

//fetch all budgets
router.get("/", verifyToken, getBudgets);

//fetch a budget details
router.get("/:id", verifyToken, getBudget);

//Update a budget details
router.put("/:id", verifyToken, updateBudget);

//Delete a budget
router.delete("/:id", verifyToken, deleteBudget);

export default router;
