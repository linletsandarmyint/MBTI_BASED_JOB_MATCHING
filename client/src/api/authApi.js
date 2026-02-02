import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};
export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const saveUserSkills = (skills) => {
  const token = localStorage.getItem("token");

  return axios.post(
    "http://localhost:5000/api/auth/skills",
    { skills },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
