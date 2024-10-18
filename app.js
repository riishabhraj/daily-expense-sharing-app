// app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// MongoDB connection and server start
mongoose
  .connect(process.env.DB_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`DB connected and Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.log(err));
