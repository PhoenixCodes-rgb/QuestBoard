const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  clearCompletedTasks,
  toggleComplete,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply protect middleware to every task route below
router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.delete("/completed/clear", clearCompletedTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/complete", toggleComplete);

module.exports = router;