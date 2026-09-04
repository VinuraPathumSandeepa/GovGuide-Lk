const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();


// ==============================
// Database
// ==============================

connectDB();


// ==============================
// Middleware
// ==============================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ==============================
// Test Route
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GovGuide LK API is running successfully",
  });
});


// ==============================
// Health Check
// ==============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    application: "GovGuide LK",
    status: "Healthy",
  });
});


// ==============================
// Error Handling
// ==============================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
  });
});


// ==============================
// Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("-----------------------------------");
  console.log("GovGuide LK Backend");
  console.log(`Server running on port ${PORT}`);
  console.log(`Local URL: http://localhost:${PORT}`);
  console.log("-----------------------------------");
});