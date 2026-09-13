import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiCalendar,
  FiCheckSquare,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiList,
  FiTarget,
  FiX,
} from "react-icons/fi";

function Sidebar({
  user,
  onLogout,
  activeTab = "dashboard",
  onSelectTab,
  taskCounts = { total: 0, completed: 0 },
  isMobileOpen = false,
  onCloseMobile,
}) {
  const userName = user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <FiHome /> },
    {
      id: "all-tasks",
      label: "All Tasks",
      icon: <FiList />,
      badge: taskCounts.total > 0 ? taskCounts.total : null,
    },
    { id: "focus", label: "Focus Timer", icon: <FiTarget /> },
    { id: "calendar", label: "Calendar", icon: <FiCalendar /> },
    {
      id: "completed",
      label: "Completed",
      icon: <FiCheckSquare />,
      badge: taskCounts.completed > 0 ? taskCounts.completed : null,
    },
    { id: "statistics", label: "Statistics", icon: <FiBarChart2 /> },
  ];

  const handleSelect = (tabId) => {
    if (onSelectTab) onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#193b27] text-white shadow-sm">
              <FiCheckSquare size={20} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#193b27] dark:text-green-400">
                QuestBoard
              </h1>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Stay productive
              </p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-[#1f2d24] dark:text-gray-300 dark:hover:bg-[#283b2f] lg:hidden"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-10 space-y-1">
          <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Workspace
          </p>

          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={activeTab === item.id}
              onClick={() => handleSelect(item.id)}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Actions & User */}
      <div className="mt-auto pt-6">
        <div className="space-y-1">
          <NavItem
            icon={<FiSettings />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => handleSelect("settings")}
          />

          <NavItem
            icon={<FiLogOut />}
            label="Log out"
            onClick={onLogout}
          />
        </div>

        {/* User Card */}
        <div
          onClick={() => handleSelect("settings")}
          className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border-t border-gray-100 px-3 pt-5 transition hover:bg-gray-50 dark:border-[#233428] dark:hover:bg-[#1f2d24]"
          title="Go to Settings"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700 dark:bg-green-950/80 dark:text-green-300">
            {userInitial}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
              {userName}
            </p>

            <p className="truncate text-xs text-gray-400 dark:text-gray-500">
              {user?.email || "Personal workspace"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-gray-100 bg-white px-5 py-7 transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c] lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative h-full w-72 max-w-[80vw] bg-white px-5 py-7 shadow-2xl transition-colors duration-200 dark:bg-[#17231c]"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ icon, label, badge, active = false, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-green-50 text-[#193b27] dark:bg-green-950/60 dark:text-green-300"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-[#1f2d24] dark:hover:text-gray-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>

      {badge !== null && badge !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            active
              ? "bg-[#193b27] text-white dark:bg-green-700"
              : "bg-gray-100 text-gray-500 dark:bg-[#111a14] dark:text-gray-400"
          }`}
        >
          {badge}
        </span>
      )}
    </motion.button>
  );
}

export default Sidebar;