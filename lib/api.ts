import axios from "axios";

const api = axios.create({
  baseURL: `${
    process.env.NEXT_PUBLIC_BASE_URL || "https://api.example.com"
  }/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional: for sending cookies if needed
});

export default api;
