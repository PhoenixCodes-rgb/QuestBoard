import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import TaskCard from "./TaskCard";

function AllTasksView({
  tasks = [],
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateTask,
  searchQuery = "",
  onClearSearch,
}) {
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'completed'
  const [priorityFilter, setPriorityFilter] = useState("all"); // 'all', 'high', 'medium', 'low'
  const [sortBy, setSortBy] = useState("date-asc"); // 'date-asc', 'date-desc', 'priority-desc', 'title'

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter === "pending") {
      list = list.filter((t) => !t.completed);
    } else if (statusFilter === "completed") {
      list = list.filter((t) => t.completed);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    // Sorting
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    list.sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === "priority-desc") {
        return (
          (priorityWeights[b.priority] || 2) - (priorityWeights[a.priority] || 2)
        );
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="mt-8 space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
            All Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and organize everything on your schedule.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onCreateTask}
          className="flex items-center gap-2 self-start rounded-full bg-[#193b27] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 sm:self-auto"
        >
          <FiPlus />
          <span>Add task</span>
        </motion.button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Total Tasks
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {totalCount}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Across all scheduled dates</p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Pending
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-amber-600 dark:text-amber-400">
            {pendingCount}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Awaiting completion</p>
        </div>

        <div className="rounded-3xl bg-[#193b27] p-5 text-white shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-green-200">
            Completed
          </p>
          <h3 className="mt-2 text-3xl font-semibold">{completedCount}</h3>
          <p className="mt-1 text-xs text-green-200">
            {totalCount > 0
              ? `${Math.round((completedCount / totalCount) * 100)}% completion rate`
              : "No tasks yet"}
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c] sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              statusFilter === "all"
                ? "bg-[#193b27] text-white dark:bg-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#111a14] dark:text-gray-300 dark:hover:bg-[#1f2d24]"
            }`}
          >
            All ({totalCount})
          </button>

          <button
            onClick={() => setStatusFilter("pending")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              statusFilter === "pending"
                ? "bg-[#193b27] text-white dark:bg-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#111a14] dark:text-gray-300 dark:hover:bg-[#1f2d24]"
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            onClick={() => setStatusFilter("completed")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              statusFilter === "completed"
                ? "bg-[#193b27] text-white dark:bg-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#111a14] dark:text-gray-300 dark:hover:bg-[#1f2d24]"
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Priority & Sort Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 outline-none transition focus:border-green-600 dark:border-[#233428] dark:bg-[#111a14] dark:text-gray-200"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 outline-none transition focus:border-green-600 dark:border-[#233428] dark:bg-[#111a14] dark:text-gray-200"
            >
              <option value="date-asc">Due Date (Earliest)</option>
              <option value="date-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (Highest)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Filter Badge */}
      {searchQuery && (
        <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-2.5 text-xs text-[#193b27] dark:bg-green-950/40 dark:text-green-300">
          <span>
            Filtering results for: <strong>"{searchQuery}"</strong> ({filteredTasks.length} found)
          </span>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            <FiX size={14} /> Clear filter
          </button>
        </div>
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
            <FiCheckCircle size={28} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">No tasks found</h3>

          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "No tasks match your search query."
              : statusFilter === "completed"
              ? "No completed tasks yet. Finish your pending tasks to see them here!"
              : "You have no tasks matching this filter."}
          </p>

          <button
            onClick={onCreateTask}
            className="mt-6 rounded-full bg-[#193b27] px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
          >
            + Create a new task
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                showDate={true}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default AllTasksView;
