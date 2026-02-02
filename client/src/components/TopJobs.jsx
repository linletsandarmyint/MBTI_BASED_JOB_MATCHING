import React from "react";

/**
 * TopJobPerMbtiTable Component
 * Shows top MBTI per job based on number of applicants
 * @param {Array} jobTrends - array of job trends from backend
 * Each item: { jobTitle: string, mbtiStats: [{ mbti: string, count: number }] }
 */
const TopJobPerMbtiTable = ({ jobTrends }) => {
  if (!jobTrends || jobTrends.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No job trend data available.
      </p>
    );
  }

  // Helper to get top MBTI for a job
  const getTopMbti = (mbtiStats) => {
    if (!mbtiStats || mbtiStats.length === 0) return null;
    return mbtiStats.reduce((prev, current) =>
      current.count > prev.count ? current : prev,
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border">Job Title</th>
            <th className="px-4 py-2 border">Top MBTI Type</th>
            <th className="px-4 py-2 border">Applicants</th>
          </tr>
        </thead>
        <tbody>
          {jobTrends.map((job, idx) => {
            const topMbti = getTopMbti(job.mbtiStats);

            return (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{job.jobTitle}</td>
                {topMbti ? (
                  <>
                    <td className="px-4 py-2 border">{topMbti.mbti}</td>
                    <td className="px-4 py-2 border">{topMbti.count}</td>
                  </>
                ) : (
                  <td className="px-4 py-2 border text-gray-400" colSpan={2}>
                    No applicants yet
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TopJobPerMbtiTable;
