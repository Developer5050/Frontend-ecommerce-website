import axios from "axios";

// Use environment variable for backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // points to Render backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;