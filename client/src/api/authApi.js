import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach token from localStorage in a single place
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers = req.headers || {};
    req.headers.Authorization = 'Bearer ' + token;
  }
  return req;
});

export default API;

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const saveUserSkills = (skills) => {
  return API.post("/auth/skills", { skills });
};
