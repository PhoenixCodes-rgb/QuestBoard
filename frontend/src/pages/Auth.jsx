import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckSquare } from "react-icons/fi";
import { loginApi, registerApi } from "../services/taskApi";

export default function Auth({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = isRegister
        ? await registerApi(formData)
        : await loginApi({ email: formData.email, password: formData.password });

      localStorage.setItem("questboard_user", JSON.stringify(data));
      onLoginSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f2] p-4 text-[#17251b]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#193b27] text-white">
            <FiCheckSquare size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#193b27]">QuestBoard</h1>
        </div>

        <h2 className="mt-6 text-2xl font-semibold">
          {isRegister ? "Create an account" : "Welcome back"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isRegister ? "Start organizing your work today." : "Please enter your details."}
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-medium text-gray-600">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:bg-white"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#193b27] py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? "Processing..." : isRegister ? "Sign up" : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="font-semibold text-green-700 hover:underline"
          >
            {isRegister ? "Log in" : "Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}