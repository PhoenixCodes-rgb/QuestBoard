import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

function Header({
  user,
  searchQuery = "",
  onSearchChange,
  onToggleSidebar,
  onSelectTab,
  tasks = [],
  onSelectDate,
}) {
  const { theme, toggleTheme } = useTheme();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef(null);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Compute smart notifications from tasks
  const notifications = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alerts = [];

    tasks.forEach((task) => {
      if (task.completed) return;

      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate < today) {
        alerts.push({
          id: `overdue-${task._id}`,
          type: "overdue",
          title: task.title,
          message: "Task is overdue",
          date: task.date,
          priority: task.priority,
        });
      } else if (taskDate.getTime() === today.getTime()) {
        alerts.push({
          id: `today-${task._id}`,
          type: "today",
          title: task.title,
          message: "Due today",
          date: task.date,
          priority: task.priority,
        });
      }
    });

    return alerts;
  }, [tasks]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  return (
    <header className="relative flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2e24] lg:hidden"
        >
          <FiMenu size={20} />
        </button>

        {/* Desktop Search Input */}
        <div className="relative hidden max-w-md flex-1 sm:block">
          <FiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            className="w-full rounded-2xl border border-transparent bg-white py-3 pl-11 pr-10 text-sm text-gray-700 outline-none shadow-sm transition placeholder:text-gray-400 focus:border-green-200 focus:ring-2 focus:ring-green-100 dark:border-transparent dark:bg-[#17231c] dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-green-900 dark:focus:ring-green-950/40"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              title="Clear search"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
          {/* Mobile search toggle button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2e24] sm:hidden"
            title="Search"
          >
            {mobileSearchOpen ? <FiX size={18} /> : <FiSearch size={18} />}
          </button>

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2e24]"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? (
              <FiSun size={18} className="text-amber-400" />
            ) : (
              <FiMoon size={18} />
            )}
          </motion.button>

          {/* Notifications button & popover */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm transition hover:text-gray-800 dark:bg-[#17231c] dark:text-gray-300 dark:hover:text-white"
              title="Notifications"
            >
              <FiBell size={18} />

              {notifications.length > 0 ? (
                <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-[#17231c]" />
              ) : (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white dark:ring-[#17231c]" />
              )}
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-40 w-80 rounded-3xl border border-gray-100 bg-white p-4 shadow-xl transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c] sm:w-96"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-[#233428]">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950/60 dark:text-red-300">
                          {notifications.length}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {notifications.length === 0 ? "Up to date" : "Needs attention"}
                    </span>
                  </div>

                  <div className="mt-3 max-h-72 space-y-2.5 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                          <FiCheckCircle size={20} />
                        </div>
                        <p className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          All caught up!
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                          No pending or overdue tasks.
                        </p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setNotificationsOpen(false);
                            if (onSelectDate && item.date) {
                              onSelectDate(new Date(item.date));
                            }
                            if (onSelectTab) onSelectTab("dashboard");
                          }}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl p-2.5 transition hover:bg-gray-50 dark:hover:bg-[#1f2d24]"
                        >
                          <div
                            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                              item.type === "overdue"
                                ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                            }`}
                          >
                            {item.type === "overdue" ? (
                              <FiAlertCircle size={15} />
                            ) : (
                              <FiClock size={15} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-gray-800 dark:text-gray-200">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              {item.message}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                              item.priority === "high"
                                ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-300"
                                : item.priority === "medium"
                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300"
                                : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => onSelectTab && onSelectTab("settings")}
            title={user?.name ? `${user.name} - View Settings` : "Settings"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#193b27] text-sm font-semibold text-white shadow-sm transition hover:scale-105 dark:bg-green-700"
          >
            {userInitial}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expandable */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden sm:hidden"
          >
            <div className="relative">
              <FiSearch
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search tasks..."
                autoFocus
                className="w-full rounded-2xl border border-gray-100 bg-white py-2.5 pl-10 pr-9 text-sm text-gray-700 outline-none shadow-sm focus:border-green-200 focus:ring-2 focus:ring-green-100 dark:border-[#233428] dark:bg-[#17231c] dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus:border-green-900"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange && onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;