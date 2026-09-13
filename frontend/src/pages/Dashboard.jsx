import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProgressCard from "../components/ProgressCard";
import TaskCard from "../components/TaskCard";
import AddTask from "../components/AddTask";
import AllTasksView from "../components/AllTasksView";
import CalendarView from "../components/CalendarView";
import CompletedView from "../components/CompletedView";
import StatisticsView from "../components/StatisticsView";
import SettingsView from "../components/SettingsView";

import {
  getTasks,
  createTask,
  toggleComplete,
  deleteTask,
  clearCompletedTasksApi,
} from "../services/taskApi";

function Dashboard({ user, onLogout, onUserUpdated }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalDate, setModalDate] = useState("");

  // Format date to YYYY-MM-DD
  const dateString = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const formattedDate = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const isToday = useMemo(() => {
    const today = new Date();
    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  }, [selectedDate]);

  // Load all tasks for the user
  const loadAllTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();
      setAllTasks(data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401 && onLogout) {
        onLogout();
        return;
      }

      setError(
        err.response?.data?.message || "Unable to load your tasks."
      );
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    loadAllTasks();
  }, [loadAllTasks]);

  // Derive tasks for currently selected date in Dashboard view
  const dayTasks = useMemo(() => {
    let list = allTasks.filter((task) => {
      const taskDate = new Date(task.date);
      const taskDateString = `${taskDate.getFullYear()}-${String(
        taskDate.getMonth() + 1
      ).padStart(2, "0")}-${String(taskDate.getDate()).padStart(2, "0")}`;
      return taskDateString === dateString;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allTasks, dateString, searchQuery]);

  // Dashboard day metrics
  const completedCount = dayTasks.filter((task) => task.completed).length;
  const totalCount = dayTasks.length;
  const completionPercentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Overall counts for badges
  const totalCompletedOverall = allTasks.filter((t) => t.completed).length;

  const changeDate = (amount) => {
    setSelectedDate((previous) => {
      const next = new Date(previous);
      next.setDate(next.getDate() + amount);
      return next;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Toggle Complete
  const handleToggle = async (id) => {
    try {
      const updatedTask = await toggleComplete(id);
      setAllTasks((previous) =>
        previous.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 && onLogout) {
        onLogout();
        return;
      }
      setError(
        err.response?.data?.message || "Unable to update the task."
      );
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    try {
      await deleteTask(id);
      setAllTasks((previous) => previous.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 && onLogout) {
        onLogout();
        return;
      }
      setError(
        err.response?.data?.message || "Unable to delete the task."
      );
    }
  };

  // Duplicate Task
  const handleDuplicate = async (task) => {
    try {
      const duplicated = await createTask({
        title: `${task.title} (Copy)`,
        description: task.description || "",
        date: task.date,
        priority: task.priority || "medium",
      });
      setAllTasks((prev) => [duplicated, ...prev]);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Unable to duplicate task."
      );
    }
  };

  // Clear all completed tasks
  const handleClearCompleted = async () => {
    try {
      await clearCompletedTasksApi();
      setAllTasks((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to clear completed tasks."
      );
    }
  };

  // Edit Task
  const handleEdit = (task) => {
    setEditingTask(task);
    setModalDate(
      task.date ? new Date(task.date).toISOString().split("T")[0] : dateString
    );
    setIsAddTaskOpen(true);
  };

  // Create Task modal trigger
  const openCreateModal = (specificDate = null) => {
    setEditingTask(null);
    setModalDate(specificDate || dateString);
    setIsAddTaskOpen(true);
  };

  const closeModal = () => {
    setIsAddTaskOpen(false);
    setEditingTask(null);
    setModalDate("");
  };

  // Task Saved callback
  const handleTaskSaved = (savedTask, isEditing) => {
    if (isEditing) {
      setAllTasks((previous) =>
        previous.map((task) =>
          task._id === savedTask._id ? savedTask : task
        )
      );
    } else {
      setAllTasks((previous) => [savedTask, ...previous]);
    }
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#17251b]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          user={user}
          onLogout={onLogout}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          taskCounts={{
            total: allTasks.length,
            completed: totalCompletedOverall,
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-7">
          {/* Header */}
          <Header
            user={user}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setIsMobileSidebarOpen(true)}
            onSelectTab={setActiveTab}
            tasks={allTasks}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setActiveTab("dashboard");
            }}
          />

          {/* Render Active View */}
          {activeTab === "all-tasks" ? (
            <AllTasksView
              tasks={allTasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onCreateTask={() => openCreateModal()}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          ) : activeTab === "calendar" ? (
            <CalendarView
              tasks={allTasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onCreateTaskForDate={(dateKey) => openCreateModal(dateKey)}
            />
          ) : activeTab === "completed" ? (
            <CompletedView
              tasks={allTasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onClearCompleted={handleClearCompleted}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          ) : activeTab === "statistics" ? (
            <StatisticsView tasks={allTasks} />
          ) : activeTab === "settings" ? (
            <SettingsView
              user={user}
              onUserUpdated={onUserUpdated}
              onLogout={onLogout}
              totalTasks={allTasks.length}
            />
          ) : (
            /* Default: Dashboard View */
            <>
              {/* Greeting */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <p className="text-sm font-medium text-green-700">
                  {isToday ? "Today" : formattedDate}
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Good day, {firstName} 👋
                </h1>

                <p className="mt-2 text-gray-500">
                  Let's make today productive.
                </p>
              </motion.section>

              {/* Stats */}
              <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ProgressCard
                  completed={completedCount}
                  total={totalCount}
                  percentage={completionPercentage}
                />

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm text-gray-500">Tasks</p>

                  <h2 className="mt-3 text-4xl font-semibold">{totalCount}</h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {completedCount} completed
                  </p>
                </div>

                <div className="rounded-3xl bg-[#193b27] p-6 text-white shadow-sm">
                  <p className="text-sm text-green-200">Productivity</p>

                  <h2 className="mt-3 text-4xl font-semibold">
                    {completionPercentage}%
                  </h2>

                  <p className="mt-2 text-sm text-green-200">
                    {totalCount === 0
                      ? "Nothing planned yet"
                      : completionPercentage === 100
                      ? "Everything completed! 🎉"
                      : "Keep going, you've got this!"}
                  </p>
                </div>
              </section>

              {/* Tasks Section */}
              <section className="mt-10">
                {/* Task header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {isToday ? "Today's tasks" : "Tasks"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => changeDate(-1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-gray-100"
                      title="Previous day"
                    >
                      <FiChevronLeft />
                    </button>

                    <button
                      onClick={goToToday}
                      disabled={isToday}
                      className="hidden rounded-full bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-100 disabled:cursor-default disabled:opacity-50 sm:block"
                    >
                      Today
                    </button>

                    <button
                      onClick={() => changeDate(1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-gray-100"
                      title="Next day"
                    >
                      <FiChevronRight />
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openCreateModal()}
                      className="ml-1 flex items-center gap-2 rounded-full bg-[#193b27] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-green-800"
                    >
                      <FiPlus />
                      <span>Add task</span>
                    </motion.button>
                  </div>
                </div>

                {/* Active search filter badge */}
                {searchQuery && (
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-green-50 px-4 py-2.5 text-xs text-[#193b27]">
                    <span>
                      Filtering this day for: <strong>"{searchQuery}"</strong> ({dayTasks.length} found)
                    </span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="flex items-center gap-1 font-semibold hover:underline"
                    >
                      <FiX size={14} /> Clear search
                    </button>
                  </div>
                )}

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                      <span>{error}</span>

                      <button
                        onClick={loadAllTasks}
                        className="flex items-center gap-2 font-medium"
                      >
                        <FiRefreshCw />
                        Retry
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading */}
                {loading ? (
                  <div className="mt-5 space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-24 animate-pulse rounded-2xl bg-white"
                      />
                    ))}
                  </div>
                ) : dayTasks.length === 0 ? (
                  /* Empty state */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-5 flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                      <FiCheckCircle size={28} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      {searchQuery
                        ? "No tasks match your search on this day"
                        : "No tasks for this day"}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                      {searchQuery
                        ? "Try clearing your search query above."
                        : "You're all clear. Add a task and start planning your day."}
                    </p>

                    <button
                      onClick={() => openCreateModal()}
                      className="mt-6 rounded-full bg-[#193b27] px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800"
                    >
                      + Add your first task
                    </button>
                  </motion.div>
                ) : (
                  /* Task list */
                  <div className="mt-5 space-y-3">
                    <AnimatePresence mode="popLayout">
                      {dayTasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onToggle={handleToggle}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onDuplicate={handleDuplicate}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Add / Edit Modal */}
      <AddTask
        isOpen={isAddTaskOpen}
        onClose={closeModal}
        onTaskSaved={handleTaskSaved}
        editingTask={editingTask}
        initialDate={modalDate || dateString}
      />
    </div>
  );
}

export default Dashboard;