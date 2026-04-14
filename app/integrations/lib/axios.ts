import axios from "axios";

const api = axios.create({
  // Point to the root; NestJS will add the /api prefix automatically
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
