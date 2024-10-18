// controllers/expenseController.js
const Expense = require("../models/Expense");
const { Parser } = require("json2csv");
const User = require("../models/User");

const addExpense = async (req, res) => {
  const { totalAmount, splitMethod, participants } = req.body;

  try {
    // Validate split method
    if (!["equal", "exact", "percentage"].includes(splitMethod)) {
      return res.status(400).json({ error: "Invalid split method" });
    }

    let participantAmounts = [];

    if (splitMethod === "equal") {
      // Equal Split: Divide the total amount equally among participants
      const equalAmount = totalAmount / participants.length;
      participantAmounts = participants.map((user) => ({
        userId: user.userId,
        amount: equalAmount,
      }));
    } else if (splitMethod === "exact") {
      // Exact Split: Use specified amounts
      const totalSpecified = participants.reduce(
        (sum, user) => sum + user.amount,
        0
      );
      if (totalSpecified !== totalAmount) {
        return res
          .status(400)
          .json({ error: "Exact amounts do not add up to total" });
      }
      participantAmounts = participants.map((user) => ({
        userId: user.userId,
        amount: user.amount,
      }));
    } else if (splitMethod === "percentage") {
      // Percentage Split: Calculate based on specified percentages
      const totalPercentage = participants.reduce(
        (sum, user) => sum + user.percentage,
        0
      );
      if (totalPercentage !== 100) {
        return res
          .status(400)
          .json({ error: "Percentages do not add up to 100%" });
      }
      participantAmounts = participants.map((user) => ({
        userId: user.userId,
        amount: (user.percentage / 100) * totalAmount,
      }));
    }

    // Create and save the expense
    const expense = new Expense({
      totalAmount,
      splitMethod,
      participants: participantAmounts,
    });
    await expense.save();

    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      "participants.userId": req.params.userId,
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOverallExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({});
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find({}).populate("participants.userId");

    // Format data for CSV
    const data = expenses.map((expense) => ({
      TotalAmount: expense.totalAmount,
      SplitMethod: expense.splitMethod,
      Participants: expense.participants.map((p) => ({
        Name: p.userId.name,
        Amount: p.amount,
      })),
    }));

    // Convert JSON to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("balance_sheet.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addExpense,
  getUserExpenses,
  getOverallExpenses,
  generateBalanceSheet,
};
