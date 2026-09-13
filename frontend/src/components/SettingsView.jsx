import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiLock,
  FiMail,
  FiCheck,
  FiAlertCircle,
  FiLogOut,
  FiShield,
  FiDatabase,
} from "react-icons/fi";
import { updateProfileApi } from "../services/taskApi";

function SettingsView({ user, onUserUpdated, onLogout, totalTasks = 0 }) {
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal profile, security credentials, and workspace preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100 text-2xl font-bold text-green-800">
            {userInitial}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              Personal Workspace
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 self-start rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 sm:self-auto"
        >
          <FiLogOut />
          <span>Log out</span>
        </button>
      </div>

      {/* Edit Profile Form Card */}
      <div className="rounded-3xl bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700">
            <FiUser size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Profile Information
            </h3>
            <p className="text-xs text-gray-400">
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
              className="mt-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-xs font-medium text-green-700"
            >
              <FiCheck size={16} />
              <span>{profileSuccess}</span>
            </motion.div>
          )}
          {profileError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              <FiAlertCircle size={16} />
              <span>{profileError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">
              Email Address (Fixed)
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-400 outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-full bg-[#193b27] px-6 py-2.5 text-xs font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
            >
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Security / Password Card */}
      <div className="rounded-3xl bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-50 text-green-700">
            <FiLock size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Security & Password
            </h3>
            <p className="text-xs text-gray-400">
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
              className="mt-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-xs font-medium text-green-700"
            >
              <FiCheck size={16} />
              <span>{passwordSuccess}</span>
            </motion.div>
          )}
          {passwordError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
            >
              <FiAlertCircle size={16} />
              <span>{passwordError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="rounded-full bg-[#193b27] px-6 py-2.5 text-xs font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* System Details Card */}
      <div className="rounded-3xl bg-white p-7 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-50 text-gray-600">
            <FiDatabase size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Workspace Information
            </h3>
            <p className="text-xs text-gray-400">Technical details & metrics.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl bg-gray-50 p-3">
            <span className="text-gray-400">Total Workspace Tasks</span>
            <p className="mt-1 text-base font-semibold text-gray-800">
              {totalTasks}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3">
            <span className="text-gray-400">User ID</span>
            <p className="mt-1 truncate font-mono font-medium text-gray-800">
              {user?._id || "N/A"}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3">
            <span className="text-gray-400">Application Version</span>
            <p className="mt-1 font-semibold text-gray-800">QuestBoard v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
