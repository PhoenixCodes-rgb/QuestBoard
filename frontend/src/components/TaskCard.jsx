import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiEdit2,
  FiTrash2,
  FiMoreHorizontal,
  FiCopy,
  FiCalendar,
} from "react-icons/fi";

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  showDate = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const priorityStyles = {
    low: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    medium: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/50 dark:text-yellow-400",
    high: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400",
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const taskDateString = task.date
    ? new Date(task.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-[#233428] dark:bg-[#17231c]"
    >
      <div className="flex min-w-0 items-center gap-4">
        {/* Complete button */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => onToggle(task._id)}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
            task.completed
              ? "border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-500"
              : "border-gray-300 text-transparent hover:border-green-600 dark:border-[#384c3e] dark:hover:border-green-500"
          }`}
          title={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          <FiCheck size={15} />
        </motion.button>

        {/* Task information */}
        <div className="min-w-0">
          <h3
            className={`truncate font-medium transition ${
              task.completed
                ? "text-gray-400 line-through dark:text-gray-600"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`mt-1 truncate text-sm ${
                task.completed
                  ? "text-gray-300 dark:text-gray-600"
                  : "text-gray-400 dark:text-gray-400"
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                priorityStyles[task.priority] ||
                priorityStyles.medium
              }`}
            >
              {task.priority || "medium"}
            </span>

            {showDate && taskDateString && (
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <FiCalendar size={12} />
                {taskDateString}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-4 flex shrink-0 items-center gap-1">
        <button
          onClick={() => onEdit(task)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-[#1f2d24] dark:hover:text-gray-200"
          title="Edit task"
        >
          <FiEdit2 size={16} />
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          title="Delete task"
        >
          <FiTrash2 size={16} />
        </button>

        {/* More dropdown button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-[#1f2d24] dark:hover:text-gray-200"
            title="More options"
          >
            <FiMoreHorizontal size={18} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 z-30 w-44 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-lg dark:border-[#233428] dark:bg-[#17231c]"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onToggle(task._id);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#1f2d24]"
                >
                  <FiCheck size={14} className="text-green-600 dark:text-green-400" />
                  {task.completed ? "Mark incomplete" : "Mark complete"}
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#1f2d24]"
                >
                  <FiEdit2 size={14} className="text-gray-500 dark:text-gray-400" />
                  Edit details
                </button>

                {onDuplicate && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(task);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-[#1f2d24]"
                  >
                    <FiCopy size={14} className="text-gray-500 dark:text-gray-400" />
                    Duplicate task
                  </button>
                )}

                <div className="my-1 border-t border-gray-100 dark:border-[#233428]" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task._id);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <FiTrash2 size={14} />
                  Delete task
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;