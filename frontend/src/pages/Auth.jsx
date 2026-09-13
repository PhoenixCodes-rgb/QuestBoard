import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckSquare, FiSun, FiMoon, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { loginApi, registerApi, checkServerHealth } from "../services/taskApi";
import { useTheme } from "../context/ThemeContext";

export default function Auth({ onLoginSuccess }) {
  const { theme, toggleTheme } = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);
  const [checkingServer, setCheckingServer] = useState(false);

  // Check server health on load
  const verifyServer = async () => {
    setCheckingServer(true);
    const isUp = await checkServerHealth();
    setServerOnline(isUp);
    setCheckingServer(false);
  };

  useEffect(() => {
    verifyServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedName = formData.name.trim();

    if (!trimmedEmail || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isRegister && !trimmedName) {
      setError("Please provide your name.");
      return;
    }

    setLoading(true);

    try {
      const payload = isRegister
        ? { name: trimmedName, email: trimmedEmail, password: formData.password }
        : { email: trimmedEmail, password: formData.password };

      const data = isRegister
        ? await registerApi(payload)
        : await loginApi(payload);

      localStorage.setItem("questboard_user", JSON.stringify(data));
      onLoginSuccess(data);
    } catch (err) {
      console.error("Auth error:", err);
      if (!err.response) {
        setServerOnline(false);
        setError(
          "Cannot connect to the server. Please ensure the backend server is running on port 5000 (run 'npm run dev' inside the backend folder)."
        );
      } else {
        setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f5f7f2] p-4 text-[#17251b] transition-colors duration-200 dark:bg-[#0f1712] dark:text-[#f0f5f1]">
      {/* Top Bar with Theme Toggle */}
      <div className="absolute right-6 top-6">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-[#233428] dark:bg-[#17231c] dark:text-gray-300 dark:hover:bg-[#1f2e24]"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <FiSun size={18} className="text-amber-400" /> : <FiMoon size={18} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-colors duration-200 dark:border-[#233428] dark:bg-[#17231c]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#193b27] text-white">
            <FiCheckSquare size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#193b27] dark:text-green-400">
            QuestBoard
          </h1>
        </div>

        <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white">
          {isRegister ? "Create an account" : "Welcome back"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isRegister ? "Start organizing your work today." : "Please enter your details."}
        </p>

        {/* Server Offline Warning Banner */}
        {!serverOnline && (
          <div className="mt-4 flex items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <div className="flex items-start gap-2">
              <FiAlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
              <span>
                <strong>Backend Server Offline:</strong> Port 5000 is not responding. Start the backend with <code className="rounded bg-amber-100 px-1 py-0.5 font-mono dark:bg-amber-900/60">npm run dev</code> in the backend folder.
              </span>
            </div>
            <button
              type="button"
              onClick={verifyServer}
              disabled={checkingServer}
              className="shrink-0 font-semibold underline hover:no-underline"
              title="Check server connection again"
            >
              <FiRefreshCw className={checkingServer ? "animate-spin" : ""} size={14} />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-3.5 text-xs leading-relaxed text-red-600 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white dark:border-[#2b3d31] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white dark:border-[#2b3d31] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:bg-white dark:border-[#2b3d31] dark:bg-[#111a14] dark:text-white dark:focus:border-green-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#193b27] py-3 text-sm font-medium text-white shadow-sm transition hover:bg-green-800 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {loading ? "Processing..." : isRegister ? "Sign up" : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="font-semibold text-green-700 hover:underline dark:text-green-400"
          >
            {isRegister ? "Log in" : "Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}