import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiBarChart2,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

function StatisticsView({ tasks = [] }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((t) => {
      if (t.completed) return false;
      const d = new Date(t.date);
      d.setHours(0, 0, 0, 0);
      return d < today;
    }).length;

    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Priority breakdown
    const high = tasks.filter((t) => t.priority === "high");
    const highCompleted = high.filter((t) => t.completed).length;

    const medium = tasks.filter((t) => t.priority === "medium" || !t.priority);
    const mediumCompleted = medium.filter((t) => t.completed).length;

    const low = tasks.filter((t) => t.priority === "low");
    const lowCompleted = low.filter((t) => t.completed).length;

    return {
      total,
      completed,
      pending,
      overdue,
      rate,
      high: { total: high.length, completed: highCompleted },
      medium: { total: medium.length, completed: mediumCompleted },
      low: { total: low.length, completed: lowCompleted },
    };
  }, [tasks]);

  return (
    <div className="mt-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Productivity Statistics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Analytics and insights into your habits and task execution.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <div className="rounded-3xl border border-transparent bg-white p-6 shadow-sm dark:border-[#233428] dark:bg-[#17231c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Total Created
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 dark:bg-[#1f3025] dark:text-gray-300">
              <FiBarChart2 size={18} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.total}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Tasks on record</p>
        </div>

        {/* Completed Tasks */}
        <div className="rounded-3xl border border-transparent bg-white p-6 shadow-sm dark:border-[#233428] dark:bg-[#17231c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Completed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
              <FiCheckCircle size={18} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-green-700 dark:text-green-400">
            {stats.completed}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Accomplished</p>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-3xl border border-transparent bg-white p-6 shadow-sm dark:border-[#233428] dark:bg-[#17231c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              In Progress
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <FiClock size={18} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-amber-600 dark:text-amber-400">
            {stats.pending}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Awaiting completion</p>
        </div>

        {/* Overdue */}
        <div className="rounded-3xl border border-transparent bg-white p-6 shadow-sm dark:border-[#233428] dark:bg-[#17231c]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Overdue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <FiAlertCircle size={18} />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-red-600 dark:text-red-400">
            {stats.overdue}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Past due date</p>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Productivity Rate Gauge */}
        <div className="flex flex-col justify-between rounded-3xl bg-[#193b27] p-7 text-white shadow-sm lg:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-green-200">
                Completion Score
              </span>
              <FiTrendingUp className="text-green-300" size={20} />
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <h2 className="text-6xl font-bold tracking-tight">{stats.rate}%</h2>
              <span className="text-sm text-green-200">finished</span>
            </div>

            <p className="mt-4 text-sm text-green-100">
              {stats.rate === 100 && stats.total > 0
                ? "Phenomenal! You've completed every single task on your list."
                : stats.rate >= 70
                ? "Impressive momentum! You're crushing the majority of your goals."
                : stats.rate >= 40
                ? "Solid progress. Keep steady focus and tick off pending items."
                : stats.total === 0
                ? "Add tasks to start measuring your productivity journey."
                : "A fresh start! Choose one high-priority task and knock it out."}
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-[#132f1f] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-400/20 text-green-300">
                <FiAward size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold">Productivity Badge</p>
                <p className="text-[11px] text-green-300">
                  {stats.rate >= 80
                    ? "Master Achiever"
                    : stats.rate >= 50
                    ? "Consistent Planner"
                    : "Rising Producer"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution Card */}
        <div className="rounded-3xl border border-transparent bg-white p-7 shadow-sm dark:border-[#233428] dark:bg-[#17231c] lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Priority Breakdown
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Review how you handle high, medium, and low priority tasks.
          </p>

          <div className="mt-6 space-y-6">
            {/* High Priority */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-red-600 dark:text-red-400">
                  High Priority
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {stats.high.completed} of {stats.high.total} completed (
                  {stats.high.total > 0
                    ? Math.round((stats.high.completed / stats.high.total) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-[#233428]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      stats.high.total > 0
                        ? (stats.high.completed / stats.high.total) * 100
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-red-500"
                />
              </div>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                  Medium Priority
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {stats.medium.completed} of {stats.medium.total} completed (
                  {stats.medium.total > 0
                    ? Math.round(
                        (stats.medium.completed / stats.medium.total) * 100
                      )
                    : 0}
                  %)
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-[#233428]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      stats.medium.total > 0
                        ? (stats.medium.completed / stats.medium.total) * 100
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-yellow-500"
                />
              </div>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Low Priority</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {stats.low.completed} of {stats.low.total} completed (
                  {stats.low.total > 0
                    ? Math.round((stats.low.completed / stats.low.total) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-[#233428]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      stats.low.total > 0
                        ? (stats.low.completed / stats.low.total) * 100
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-[#233428] dark:bg-[#121c15]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                💡 <strong>Tip:</strong> Clear high-priority items first in your morning to maximize daily output.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsView;
