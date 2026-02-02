import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
const token = localStorage.getItem("token");
// automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getAdminDashboardStats = () => API.get("/admin/dashboard");
export const getAdminUsers = (search, role, status) =>
  API.get("/admin/users", { params: { search, role, status } });
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/status`);

export const deleteUserAdmin = (id) => API.delete(`/admin/users/${id}`);

export const getAdminJobs = (search, status) =>
  API.get("/admin/jobs", { params: { search, status } });

export const toggleJobArchive = (id) => API.put(`/admin/jobs/${id}/archive`);

export const deleteJobAdmin = (id) => API.delete(`/admin/jobs/${id}`);

export const getJobById = (id) => API.get(`/admin/jobs/${id}`);

/* ================= MBTI QUESTION API ================= */

// Get all questions (active + archived)
export const getAdminMbtiQuestions = (status) =>
  API.get("/admin/mbti/questions", { params: { status } });

// Archive / Unarchive question
export const toggleMbtiQuestionStatus = (id) =>
  API.put(`/admin/mbti/questions/${id}/status`);

// Create question(s)
export const createMbtiQuestions = (questions) =>
  API.post("/admin/mbti/questions", { questions });
export const updateMbtiQuestion = (id, data) =>
  API.put(`/admin/mbti/questions/${id}`, data);
export const deleteMbtiQuestion = (id) =>
  API.delete(`/admin/mbti/questions/${id}`);
export const approveJobAdmin = (id) => API.put(`/admin/jobs/${id}/approve`);
export const rejectJobAdmin = (id) => API.put(`/admin/jobs/${id}/reject`);
export const getAdminAuditLogs = () => {
  return axios.get("/admin/audit-logs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
