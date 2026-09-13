require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const errorMiddleware = require("./middlewares/errorMiddleware");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth",authRoutes);

// Database
connectDB();


// Routes
app.use("/tasks", taskRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({
    message: "QuestBoard API is running",
  });
});


// Error middleware
app.use(errorMiddleware);


// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});