import axios from "axios";

export const CLOUD_BACKEND_URL = "https://questboard-backend-nxei.onrender.com";

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  // If running locally in Vite dev mode with local backend
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost" &&
    window.location.port === "5173"
  ) {
    // Return empty to use Vite proxy if local backend is running, otherwise CLOUD_BACKEND_URL
    return "";
  }
  return CLOUD_BACKEND_URL;
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 45000, // Render free tier can take up to 40s to wake up from cold sleep
});

export const checkServerHealth = async () => {
  try {
    const res = await API.get("/");
    return Boolean(res.data?.message);
  } catch {
    try {
      const res = await axios.get(`${CLOUD_BACKEND_URL}/`, { timeout: 8000 });
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