import API from "./authApi";

export const getMbtiJobTrendsApi = async () => {
  const res = await API.get('/analytics/mbti-job-trends');
  return res.data;
};

export const getJobTrends = async () => {
  const res = await API.get('/analytics/job-trends');
  return res.data;
};
