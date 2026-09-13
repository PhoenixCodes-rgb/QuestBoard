import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCalendar, FiFlag } from "react-icons/fi";
import { createTask, updateTask } from "../services/taskApi";

function AddTask({
  isOpen,
  onClose,
  onTaskSaved,
  editingTask = null,
  initialDate = "",
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(editingTask);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        date: editingTask.date
          ? new Date(editingTask.date).toISOString().split("T")[0]
          : "",
        priority: editingTask.priority || "medium",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: initialDate || new Date().toISOString().split("T")[0],
        priority: "medium",
      });
    }

    setError("");
  }, [editingTask, isOpen, initialDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let savedTask;

      if (isEditing) {
        savedTask = await updateTask(editingTask._id, formData);
      } else {
        savedTask = await createTask(formData);
      }

      if (onTaskSaved) {
        onTaskSaved(savedTask, isEditing);
      }

      setFormData({
        title: "",
        description: "",
        date: "",
        priority: "medium",
      });

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isEditing ? "Edit task" : "Create a new task"}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {isEditing
                    ? "Update the details of your task."
                    : "What do you want to accomplish?"}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-[#1f2d24] dark:text-gray-300 dark:hover:bg-[#283b2f]"
              >
                <FiX />
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Study DSA"
                  autoFocus
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#2b3d31] dark:bg-[#111a14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:bg-[#111a14]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Add some details..."
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#2b3d31] dark:bg-[#111a14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-green-500 dark:focus:bg-[#111a14]"
                />
              </div>

              {/* Date + Priority */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>

                  <div className="relative">
                    <FiCalendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#2b3d31] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority
                  </label>

                  <div className="relative">
                    <FiFlag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pl-11 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#2b3d31] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-full px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-[#1f2d24]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="min-w-32 rounded-full bg-[#193b27] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  {loading
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                    ? "Save changes"
                    : "Create task"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddTask;