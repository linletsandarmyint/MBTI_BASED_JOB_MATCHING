import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  Search,
  Filter,
  Sparkles,
  CheckCircle,
  Briefcase,
} from "lucide-react";
/* ---------------- JOB CARD ---------------- */
const MatchJobCard = ({ job, onView }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {job.description}
        </p>
      </div>

      
    </div>

    <div className="flex flex-wrap gap-2 mt-3">
      {job.requiredSkills?.slice(0, 6).map((s) => (
        <span key={s} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
          {s}
        </span>
      ))}
    </div>

    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-600">
        <span className="mr-2">📍 {job.location}</span>
        <span className="mr-2">• {job.jobType}</span>
      </div>

      <button
        onClick={() => onView(job)}
        className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-2xl hover:bg-teal-600 transition"
      >
        <Sparkles size={18} />
        View
      </button>
    </div>
  </div>
);

/* ================= MAIN PAGE ================= */
export default function MatchedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobType, setJobType] = useState("All");
  const [location, setLocation] = useState("All");
  const [search, setSearch] = useState("");
  const [showMbtiOnly, setShowMbtiOnly] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedJob, setSelectedJob] = useState(null);
  const [aiExplain, setAiExplain] = useState(null);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showMyApplications, setShowMyApplications] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!selectedJob) return; // important!

    axios
      .get(`/jobs/${selectedJob._id}/application-status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setHasApplied(res.data.hasApplied))
      .catch(() => setHasApplied(false));
  }, [selectedJob]);

  /* ---------------- FETCH MATCHED JOBS ---------------- */
  useEffect(() => {
    axios
      .get("/jobs/matched", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setJobs(res.data);
        setFilteredJobs(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  /* ---------------- CHECK APPLICATION STATUS ---------------- */
  useEffect(() => {
    if (!selectedJob) return;

    axios
      .get(`/jobs/${selectedJob._id}/application-status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setHasApplied(res.data.hasApplied))
      .catch(() => setHasApplied(false));
  }, [selectedJob]);
  /* ---------------- FETCH APPLICATIONS ---------------- */
  useEffect(() => {
    if (!showMyApplications) return;

    axios
      .get("/jobs/applications/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setApplications(res.data))
      .catch((err) => console.log(err));
  }, [showMyApplications]);
  /* ---------------- APPLY FILTERS ---------------- */
  const applyFilters = () => {
    let temp = [...jobs];

    if (jobType !== "All") {
      temp = temp.filter((j) => j.jobType === jobType);
    }
    if (location !== "All") {
      temp = temp.filter((j) => j.location === location);
    }
    if (search) {
      temp = temp.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.company?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (showMbtiOnly) {
      temp = temp.filter(
        (j) => j.matchLabel === "Strong Match" || j.matchLabel === "Good Match"
      );
    }

    if (sortBy === "Newest") {
      temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "MBTI Relevance") {
      temp.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "Company A-Z") {
      temp.sort((a, b) => a.company.name.localeCompare(b.company.name));
    }

    setFilteredJobs(temp);
  };
  const AppliedJobCard = ({ job, status }) => {
    if (!job) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {job.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-gray-600 border border-gray-200 px-2 py-1 rounded-full">
                {job.location} • {job.locationType}
              </span>
              <span className="text-xs text-gray-600 border border-gray-200 px-2 py-1 rounded-full">
                {job.jobType}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                status === "applied"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    );
  };


  /* ---------------- OPEN MODAL ---------------- */
  const openModal = async (job) => {
    setSelectedJob(job);

    try {
      const res = await axios.get(`/jobs/ai-explain/${job._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setAiExplain(res.data.ai);
    } catch (err) {
      console.log(err);
    }
  };
  

  /* ---------------- APPLY JOB ---------------- */
  const applyJob = async () => {
    setApplying(true);
    try {
      await axios.post(
        `/jobs/${selectedJob._id}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setHasApplied(true);
      alert("✅ Applied successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Already applied");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center">
            Find Your Perfect Career Match
          </h1>
          <p className="text-center mt-3 text-lg">
            Discover opportunities aligned with your personality type.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-2xl shadow p-5 flex flex-wrap gap-4 items-center">
          <button className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-2xl">
            <CheckCircle size={18} /> Matched Jobs
          </button>
          <button
            onClick={() => setShowMyApplications(!showMyApplications)}
            className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-2xl"
          >
            <Briefcase size={18} /> My Applications
          </button>

          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-500">Job Type</span>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option>All</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>

          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-500">Location</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option>All</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="flex flex-1 gap-2 items-center">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, companies..."
              className="flex-1 border rounded-2xl px-4 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showMbtiOnly}
              onChange={(e) => setShowMbtiOnly(e.target.checked)}
            />
            <span className="text-sm">Show MBTI matches only</span>
          </div>

          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-500">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option>Newest</option>
              <option>MBTI Relevance</option>
              <option>Company A-Z</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-2xl"
          >
            <Filter size={18} /> Apply
          </button>
        </div>
      </div>

      {/* GRID JOB LIST + APPLICATION PANEL */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div
          className={`grid ${
            showMyApplications
              ? "grid-cols-1 lg:grid-cols-3 gap-6"
              : "grid-cols-1 lg:grid-cols-3 gap-6"
          }`}
        >
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <MatchJobCard key={job._id} job={job} onView={openModal} />
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          {showMyApplications && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 border shadow-sm">
                <h3 className="font-semibold text-lg mb-4">My Applications</h3>

                {applications.length === 0 ? (
                  <p className="text-gray-500">No applications yet.</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <AppliedJobCard
                        key={app._id}
                        job={app.job}
                        status={app.status}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-11/12 md:w-2/5 h-[80vh] overflow-y-auto p-6 hide-scrollbar relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setSelectedJob(null)}
            >
              <X size={24} />
            </button>
            {hasApplied && (
              <span className="inline-block mb-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                Applied
              </span>
            )}

            <h3 className="text-2xl font-semibold">{selectedJob.title}</h3>
            <p className="text-sm text-gray-600 mt-2">
              {selectedJob.description}
            </p>

            {/* IMPORTANT INFO CARD */}
            <div className="mt-5 bg-gray-50 p-4 rounded border">
              <div className="flex justify-between">
                <span className="font-semibold">Company</span>
                <span>{selectedJob.company?.name || "Unknown"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold">Location</span>
                <span>{selectedJob.location}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold">Job Type</span>
                <span>{selectedJob.jobType}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold">Match Score</span>
                <span>{selectedJob.matchScore}%</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-semibold">MBTI Match</span>
                <span>{selectedJob.matchLabel}</span>
              </div>
            </div>

            {/* AI EXPLAIN */}
            <div className="mt-5 ">
              <h4 className="font-semibold">AI Explanation</h4>

              {!aiExplain ? (
                <p className="text-gray-500 mt-2">Loading AI explanation...</p>
              ) : (
                <div className="mt-3 text-sm text-gray-700 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="font-semibold">Job Summary</p>
                    <p className="mt-1">{aiExplain.jobSummary}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="font-semibold">Skill Match</p>
                    <p className="mt-1">
                      {aiExplain.skillMatch.percentage}% —{" "}
                      {aiExplain.skillMatch.details}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="font-semibold">MBTI Match</p>
                    <p className="mt-1">
                      {aiExplain.mbtiMatch.percentage}% —{" "}
                      {aiExplain.mbtiMatch.details}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border">
                    <p className="font-semibold">Recommendation</p>
                    <p className="mt-1">{aiExplain.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
            {/* APPLY ROW */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                onClick={applyJob}
                disabled={hasApplied || applying}
                className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-white ${
                  hasApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                <Briefcase size={18} />
                {hasApplied
                  ? "Already Applied"
                  : applying
                  ? "Applying..."
                  : "Apply Now"}
              </button>

              <span className="text-sm text-gray-500 whitespace-nowrap">
                MBTI Match: {selectedJob.matchLabel}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
