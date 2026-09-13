import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.port === "5173") {
    return "";
  }
  return "http://localhost:5000";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

export const checkServerHealth = async () => {
  try {
    const res = await API.get("/");
    return Boolean(res.data?.message);
  } catch {
    const fallbackUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const res = await axios.get(`${fallbackUrl}/`);
      return Boolean(res.data?.message);
    } catch {
      return false;
    }
  }
};

// Auto-inject JWT into headers
API.interceptors.request.use((config) => {
  const user = JSON.parse(
    localStorage.getItem("questboard_user") || "null"
  );
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API Calls
export const loginApi = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const updateProfileApi = async (profileData) => {
  const response = await API.put("/auth/profile", profileData);
  return response.data;
};

// Task API Calls
export const getTasks = async (params = {}) => {
  const response = await API.get("/tasks", { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await API.patch(`/tasks/${id}`, taskData);
  return response.data;
};

export const toggleComplete = async (id) => {
  const response = await API.patch(`/tasks/${id}/complete`);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

export const clearCompletedTasksApi = async () => {
  const response = await API.delete("/tasks/completed/clear");
  return response.data;
};