import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const createJobApi = (jobData) => API.post("/jobs", jobData);

export const getMyJobsApi = () => API.get("/api/jobs/my");

export const updateJobApi = (id, jobData) => API.put(`/api/jobs/${id}`, jobData);

export const deleteJobApi = (id) => API.delete(`/api/jobs/${id}`);

// COMPANY JOBS WITH APPLICANT COUNT
export const getCompanyJobsWithCountApi = () => API.get("/api/jobs/company/me");

// GET APPLICANTS FOR ONE JOB
export const getJobApplicationsApi = (jobId) =>
  API.get(`/api/jobs/${jobId}/applications`);

// COMPANY REVIEW / ACCEPT / REJECT
export const reviewApplicationApi = (appId) =>
  API.put(`/api/jobs/applications/${appId}/review`);

export const acceptApplicationApi = (appId) =>
  API.put(`/api/jobs/applications/${appId}/accept`);

export const rejectApplicationApi = (appId) =>
  API.put(`/api/jobs/applications/${appId}/reject`);

export const updateApplicationStatusApi = (appId, status) =>
  API.put(`/api/jobs/applications/${appId}/status`, { status });
