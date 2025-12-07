import {
  exchangeCode,
  getTransactions,
  getAccountDetails,
  deleteMonoAccount,
} from "../controllers/mono-controller";

const router = require("express").Router();

// Create a Code Exchange
router.post("/exchange", exchangeCode);

//fetch an account details
router.get("/account/:id", getAccountDetails);

//Update account transactions
router.get("/account/:id/transactions", getTransactions);

//Delete a mono account
router.delete("/:id", deleteMonoAccount);

export default router;
