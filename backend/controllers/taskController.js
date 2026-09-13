const Task = require("../models/Task");
const asyncHandler = require("../middlewares/asyncHandler");

// CREATE TASK: Tag with req.user._id
const createTask = asyncHandler(async (req, res) => {
  const { title, description, date, priority } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  const task = await Task.create({
    user: req.user._id, // Set the owner
    title,
    description,
    date,
    priority,
  });

  res.status(201).json(task);
});

// GET TASKS: Only fetch tasks owned by req.user._id with optional filters
const getTasks = asyncHandler(async (req, res) => {
  const { date, completed, priority, search } = req.query;

  // Enforce user boundary
  const filter = { user: req.user._id };

  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    filter.date = { $gte: start, $lte: end };
  }

  if (completed !== undefined) {
    filter.completed = completed === "true";
  }

  if (priority) {
    filter.priority = priority;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const tasks = await Task.find(filter).sort({ date: 1, createdAt: -1 });
  res.json(tasks);
});

// UPDATE TASK: findOneAndUpdate matching id AND user
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: id, user: req.user._id }, // Authorization check
    updates,
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found or unauthorized" });
  }

  res.json(task);
});

// DELETE TASK: findOneAndDelete matching id AND user
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ message: "Task not found or unauthorized" });
  }

  res.json({ message: "Task deleted successfully", task });
});

// TOGGLE COMPLETION: Verify ownership before saving
const toggleComplete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({ _id: id, user: req.user._id });

  if (!task) {
    return res.status(404).json({ message: "Task not found or unauthorized" });
  }

  task.completed = !task.completed;
  await task.save();

  res.json(task);
});

// CLEAR COMPLETED TASKS
const clearCompletedTasks = asyncHandler(async (req, res) => {
  const result = await Task.deleteMany({
    user: req.user._id,
    completed: true,
  });

  res.json({
    message: "Completed tasks cleared",
    deletedCount: result.deletedCount,
  });
});

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  clearCompletedTasks,
  toggleComplete,
};