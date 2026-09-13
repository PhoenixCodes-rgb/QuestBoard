import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiCheck,
  FiAlertCircle,
  FiLogOut,
  FiDatabase,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { updateProfileApi } from "../services/taskApi";
import { useTheme } from "../context/ThemeContext";

function SettingsView({ user, onUserUpdated, onLogout, totalTasks = 0 }) {
  const { theme, setTheme } = useTheme();

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError("Name cannot be empty");
      return;
    }

    try {
      setProfileSaving(true);
      setProfileError("");
      setProfileSuccess("");

      const updated = await updateProfileApi({ name: name.trim() });
      if (onUserUpdated) onUserUpdated(updated);
      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setPasswordSaving(true);
      const updated = await updateProfileApi({
        currentPassword,
        newPassword,
      });

      if (onUserUpdated) onUserUpdated(updated);
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="mt-8 max-w-4xl space-y-8">
      {/* View Title */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your personal profile, appearance theme, security credentials, and workspace preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100 text-2xl font-bold text-green-800 dark:bg-green-950/80 dark:text-green-300">
            {userInitial}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
              Personal Workspace
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 self-start rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-[#233428] dark:text-gray-300 dark:hover:bg-[#1f2e24] sm:self-auto"
        >
          <FiLogOut />
          <span>Log out</span>
        </button>
      </div>

      {/* Appearance / Theme Settings Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-[#233428]">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            {theme === "dark" ? <FiMoon size={18} /> : <FiSun size={18} />}
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Appearance & Theme
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Choose between light and dark mode.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Light Theme Option */}
          <div
            onClick={() => setTheme("light")}
            className={`cursor-pointer rounded-2xl border p-4 transition ${
              theme === "light"
                ? "border-green-600 bg-green-50/50 ring-2 ring-green-600/30"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-[#233428] dark:bg-[#111a14] dark:hover:bg-[#1b271f]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                  <FiSun size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Light Theme
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Clean, crisp off-white background
                  </p>
                </div>
              </div>
              {theme === "light" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                  <FiCheck size={14} />
                </div>
              )}
            </div>
          </div>

          {/* Dark Theme Option */}
          <div
            onClick={() => setTheme("dark")}
            className={`cursor-pointer rounded-2xl border p-4 transition ${
              theme === "dark"
                ? "border-green-600 bg-green-950/30 ring-2 ring-green-600/30"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-[#233428] dark:bg-[#111a14] dark:hover:bg-[#1b271f]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f1712] text-amber-400 shadow-sm">
                  <FiMoon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Dark Theme
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Atmospheric forest charcoal aesthetic
                  </p>
                </div>
              </div>
              {theme === "dark" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
                  <FiCheck size={14} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-[#233428]">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400">
            <FiUser size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Update your account display name.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {profileSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300"
            >
              <FiCheck size={16} />
              <span>{profileSuccess}</span>
            </motion.div>
          )}
          {profileError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300"
            >
              <FiAlertCircle size={16} />
              <span>{profileError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#233428] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Email Address (Fixed)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-400 outline-none dark:border-[#233428] dark:bg-[#111a14] dark:text-gray-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-full bg-[#193b27] px-6 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-800 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Security / Password Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-[#233428]">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400">
            <FiLock size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Security & Password
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Ensure your account is using a long, secure password.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {passwordSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300"
            >
              <FiCheck size={16} />
              <span>{passwordSuccess}</span>
            </motion.div>
          )}
          {passwordError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300"
            >
              <FiAlertCircle size={16} />
              <span>{passwordError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#233428] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#233428] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100 dark:border-[#233428] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-full bg-[#193b27] px-6 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-800 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* System Details Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-[#233428]">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 dark:bg-[#111a14] dark:text-gray-400">
            <FiDatabase size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Workspace Information
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">Technical details & metrics.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl bg-gray-50 p-3 dark:bg-[#111a14]">
            <span className="text-gray-400 dark:text-gray-500">Total Workspace Tasks</span>
            <p className="mt-1 text-base font-semibold text-gray-800 dark:text-gray-200">
              {totalTasks}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3 dark:bg-[#111a14]">
            <span className="text-gray-400 dark:text-gray-500">User ID</span>
            <p className="mt-1 truncate font-mono font-medium text-gray-800 dark:text-gray-200">
              {user?._id || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3 dark:bg-[#111a14]">
            <span className="text-gray-400 dark:text-gray-500">Application Version</span>
            <p className="mt-1 font-semibold text-gray-800 dark:text-gray-200">QuestBoard v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
