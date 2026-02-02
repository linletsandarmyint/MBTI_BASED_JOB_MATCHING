import React, { useEffect, useState } from "react";
import { getJobTrends } from "../api/analyticsApi";
import MbtiBarChart from "../components/MbtiBarChart";

const MbtiAnalytics = () => {
  const [jobTrends, setJobTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await getJobTrends();
        setJobTrends(res?.jobTrends || []);
      } catch (err) {
        console.error("Analytics load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">MBTI Job Analytics</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <MbtiBarChart jobTrends={jobTrends} />
        </div>
      </div>
    </div>
  );
};

export default MbtiAnalytics;
