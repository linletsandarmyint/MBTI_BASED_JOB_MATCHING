import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if needed
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
export const getMyJobsApi = () => API.get("/jobs/my");
export const updateJobApi = (id, jobData) => API.put(`/jobs/${id}`, jobData);

export const deleteJobApi = (id) => API.delete(`/jobs/${id}`);


// COMPANY JOBS WITH APPLICANT COUNT
export const getCompanyJobsWithCountApi = () =>
  API.get("/jobs/company/me");

// GET APPLICANTS FOR ONE JOB
export const getJobApplicationsApi = (jobId) =>
  API.get(`/jobs/${jobId}/applications`);

// COMPANY REVIEW / ACCEPT / REJECT
export const reviewApplicationApi = (appId) =>
  API.put(`/jobs/applications/${appId}/review`);

export const acceptApplicationApi = (appId) =>
  API.put(`/jobs/applications/${appId}/accept`);

export const rejectApplicationApi = (appId) =>
  API.put(`/jobs/applications/${appId}/reject`);
export const updateApplicationStatusApi = (appId, status) =>
  API.put(`/jobs/applications/${appId}/status`, { status });
