import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiCalendar,
} from "react-icons/fi";
import TaskCard from "./TaskCard";

function CalendarView({
  tasks = [],
  onToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onCreateTaskForDate,
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const [selectedDay, setSelectedDay] = useState(new Date());

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month padding days to make full grid of 35 or 42
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  // Map tasks to dates (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const selectedDayKey = useMemo(() => {
    return `${selectedDay.getFullYear()}-${String(
      selectedDay.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDay.getDate()).padStart(2, "0")}`;
  }, [selectedDay]);

  const selectedDayTasks = tasksByDate[selectedDayKey] || [];

  const changeMonth = (offset) => {
    setCurrentMonth((prev) => {
      return new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
    });
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(now);
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const formattedSelectedDate = selectedDay.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const today = new Date();
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  return (
    <div className="mt-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View your schedule and tasks by month and day.
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-[#233428] dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2d24]"
            title="Previous month"
          >
            <FiChevronLeft size={18} />
          </button>

          <span className="min-w-36 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
            {monthName}
          </span>

          <button
            onClick={() => changeMonth(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-[#233428] dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2d24]"
            title="Next month"
          >
            <FiChevronRight size={18} />
          </button>

          <button
            onClick={goToToday}
            className="ml-2 rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-100 dark:border-[#233428] dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2d24]"
          >
            Today
          </button>
        </div>
      </div>

      {/* Main Calendar Card */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 border-b border-gray-100 pb-3 text-center text-xs font-semibold text-gray-400 dark:border-[#233428] dark:text-gray-500">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="mt-3 grid grid-cols-7 gap-2">
          {calendarDays.map((item, index) => {
            const dateKey = `${item.date.getFullYear()}-${String(
              item.date.getMonth() + 1
            ).padStart(2, "0")}-${String(item.date.getDate()).padStart(2, "0")}`;

            const dayTasks = tasksByDate[dateKey] || [];
            const isSelected = isSameDay(item.date, selectedDay);
            const isTodayCell = isSameDay(item.date, today);

            const completedDayCount = dayTasks.filter((t) => t.completed).length;
            const pendingDayCount = dayTasks.length - completedDayCount;

            return (
              <button
                key={index}
                onClick={() => setSelectedDay(item.date)}
                className={`relative flex min-h-16 flex-col items-center justify-between rounded-2xl p-2 transition sm:min-h-20 ${
                  isSelected
                    ? "bg-[#193b27] text-white shadow-md dark:bg-green-700"
                    : isTodayCell
                    ? "bg-green-50 text-green-800 ring-2 ring-green-600 dark:bg-green-950/60 dark:text-green-300 dark:ring-green-500"
                    : item.isCurrentMonth
                    ? "text-gray-800 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-[#1f2d24]"
                    : "text-gray-300 hover:bg-gray-50 dark:text-gray-600 dark:hover:bg-[#141d17]"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isSelected
                        ? "text-white"
                        : isTodayCell
                        ? "text-green-700 font-bold dark:text-green-300"
                        : ""
                    }`}
                  >
                    {item.date.getDate()}
                  </span>

                  {dayTasks.length > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                        isSelected
                          ? "bg-white text-[#193b27]"
                          : "bg-gray-100 text-gray-600 dark:bg-[#111a14] dark:text-gray-300"
                      }`}
                    >
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                {/* Task dots */}
                {dayTasks.length > 0 && (
                  <div className="mt-auto flex items-center gap-1">
                    {pendingDayCount > 0 && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-amber-300" : "bg-amber-500"
                        }`}
                      />
                    )}
                    {completedDayCount > 0 && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-green-300" : "bg-green-400"
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Task Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tasks for {formattedSelectedDate}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedDayTasks.length} task
              {selectedDayTasks.length === 1 ? "" : "s"} scheduled
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onCreateTaskForDate(selectedDayKey)}
            className="flex items-center gap-2 self-start rounded-full bg-[#193b27] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 sm:self-auto"
          >
            <FiPlus />
            <span>Add task for this day</span>
          </motion.button>
        </div>

        {selectedDayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <FiCalendar size={22} />
            </div>
            <h4 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
              No tasks scheduled for this day
            </h4>
            <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
              Enjoy your free time or schedule something to work on.
            </p>
            <button
              onClick={() => onCreateTaskForDate(selectedDayKey)}
              className="mt-4 rounded-full bg-[#193b27] px-4 py-2 text-xs font-medium text-white transition hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600"
            >
              + Add a task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {selectedDayTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
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
    </div>
  );
}

export default CalendarView;
