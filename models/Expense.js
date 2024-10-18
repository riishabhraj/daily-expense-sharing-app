const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  totalAmount: { type: Number, required: true },
  splitMethod: {
    type: String,
    enum: ["equal", "exact", "percentage"],
    required: true,
  },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: Number,
    },
  ],
});

module.exports = mongoose.model("Expense", expenseSchema);
