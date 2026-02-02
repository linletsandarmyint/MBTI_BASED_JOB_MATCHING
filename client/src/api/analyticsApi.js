import axios from "axios";

// Make sure your backend base URL is correct
const API_BASE_URL = "http://localhost:5000/api";

// Optional: If using token-based auth
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // or wherever you store your JWT
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ---------------- API CALL ----------------

// Get MBTI Job Trends (all jobs, no MBTI filter)
export const getMbtiJobTrendsApi = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/analytics/mbti-job-trends`,
      getAuthHeaders(),
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching MBTI job trends:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
// 🔹 NEW: Top Job per MBTI
export const getJobTrends = async () => {
  const res = await axios.get(
    `${API_BASE_URL}/analytics/job-trends`,
    getAuthHeaders()
  );
  return res.data;
};