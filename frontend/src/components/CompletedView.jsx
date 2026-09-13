import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiTrash2, FiX } from "react-icons/fi";
import TaskCard from "./TaskCard";

function CompletedView({
  tasks = [],
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onClearCompleted,
  searchQuery = "",
  onClearSearch,
}) {
  const completedTasks = useMemo(() => {
    let list = tasks.filter((t) => t.completed);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort by latest completed / date descending
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [tasks, searchQuery]);

  const totalAllTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage =
    totalAllTasks === 0 ? 0 : Math.round((completedCount / totalAllTasks) * 100);

  const handleClear = () => {
    if (completedTasks.length === 0) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete all completed tasks? This action cannot be undone."
    );
    if (confirmed && onClearCompleted) {
      onClearCompleted();
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
            Completed Tasks
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A review of all tasks you've accomplished.
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 self-start rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 sm:self-auto"
          >
            <FiTrash2 size={14} />
            <span>Clear all completed</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Finished Tasks
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">
              {completedCount}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              out of {totalAllTasks} total
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Great work staying on top of your responsibilities!
          </p>
        </div>

        <div className="rounded-3xl bg-[#193b27] p-6 text-white shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-green-200">
            Overall Completion Rate
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <h2 className="text-4xl font-semibold">{percentage}%</h2>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-green-900">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-green-400"
            />
          </div>
        </div>
      </div>

      {/* Search query banner */}
      {searchQuery && (
        <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-2.5 text-xs text-[#193b27] dark:bg-green-950/40 dark:text-green-300">
          <span>
            Filtering completed tasks for: <strong>"{searchQuery}"</strong> ({completedTasks.length} found)
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
      {completedTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
            <FiCheckCircle size={28} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
            {searchQuery
              ? "No matching completed tasks"
              : "No completed tasks yet"}
          </h3>

          <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try adjusting your search terms."
              : "When you mark tasks as done in your Dashboard or All Tasks view, they will be proudly displayed here."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {completedTasks.map((task) => (
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

export default CompletedView;
