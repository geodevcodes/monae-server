import {
  exchangeCode,
  getTransactions,
  getAccountDetails,
  deleteMonoAccount,
  getOrCreateCustomer,
} from "../controllers/mono-controller";
import { verifyToken } from "../middlewares/verify-token";

const router = require("express").Router();

// Create a Code Exchange
router.post("/exchange", verifyToken, exchangeCode);

// New route
router.get("/customer", verifyToken, getOrCreateCustomer);

//fetch an account details
router.get("/account/:id", verifyToken, getAccountDetails);

//Update account transactions
router.get("/account/:id/transactions", verifyToken, getTransactions);

//Delete a mono account
router.delete("/:id", verifyToken, deleteMonoAccount);

export default router;
