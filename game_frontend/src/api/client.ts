import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// PUBLIC_INTERFACE
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add JWT from cookies (if present) to Authorization header automatically.
api.interceptors.request.use((config) => {
  const token = Cookies.get("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optionally: Add response/error interceptors for handling 401/session expiry/etc.

