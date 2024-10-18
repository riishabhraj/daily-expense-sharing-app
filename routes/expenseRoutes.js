const express = require("express");
const router = express.Router();
const {
  addExpense,
  getUserExpenses,
  getOverallExpenses,
  generateBalanceSheet,
} = require("../controllers/expenseController");

// Route to add a new expense
router.post("/add", addExpense);

// Route to retrieve expenses for a specific user
router.get("/user/:userId", getUserExpenses);

// Route to retrieve overall expenses for all users
router.get("/overall", getOverallExpenses);

// Route to generate and download the balance sheet as a CSV file
router.get("/balance-sheet", generateBalanceSheet);

module.exports = router;
