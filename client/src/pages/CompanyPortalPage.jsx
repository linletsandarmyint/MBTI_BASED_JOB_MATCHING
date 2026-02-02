import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  X,
  Briefcase,
  Star,
  Target,
  MapPin,
  Search,
  Filter,
  CheckCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  createJobApi,
  
  updateJobApi,
  deleteJobApi,
  getJobApplicationsApi,
  updateApplicationStatusApi,
  getCompanyJobsWithCountApi
} from "../api/jobApi";

const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

export default function CompanyPortal() {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    locationType: "Remote",
    jobType: "Full-time",
    skills: [],
    mbti: [],
    skillInput: "",
  });

  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // ================= LOAD MY JOBS =================
  const fetchMyJobs = async () => {
    try {
      const res = await getCompanyJobsWithCountApi();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchMyJobs();
  }, []);

  // ================= ADD SKILL =================
  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm({
        ...form,
        skills: [...form.skills, skill],
        skillInput: "",
      });
    }
  };

  // ================= CREATE JOB =================
  const saveJob = async () => {
    try {
      if (!form.title.trim()) {
        alert("Title is required");
        return;
      }
      if (!form.location.trim()) {
        alert("Location is required");
        return;
      }
      if (form.skills.length === 0) {
        alert("Skills are required");
        return;
      }

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        locationType: form.locationType,
        jobType: form.jobType,
        requiredSkills: form.skills,
        preferredMbtiTypes: form.mbti,
      };

      let res;

      if (editingJob) {
        res = await updateJobApi(editingJob._id, payload);
      } else {
        res = await createJobApi(payload);
      }

      if (res.status === 201 || res.status === 200) {
        alert("✅ Job saved successfully");
        setShowForm(false);
        fetchMyJobs();
        setEditingJob(null);

        setForm({
          title: "",
          description: "",
          location: "",
          locationType: "Remote",
          jobType: "Full-time",
          skills: [],
          mbti: [],
          skillInput: "",
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  // ================= DELETE JOB =================
  const handleDelete = async (id) => {
    try {
      await deleteJobApi(id);
      alert("Job deleted successfully");
      fetchMyJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ================= EDIT JOB =================
  const handleEdit = (job) => {
    setShowForm(true);
    setEditingJob(job);

    setForm({
      title: job.title,
      description: job.description,
      location: job.location,
      locationType: job.locationType,
      jobType: job.jobType,
      skills: job.requiredSkills || [],
      mbti: job.preferredMbtiTypes || [],
      skillInput: "",
    });
  };

  // ================= VIEW APPLICANTS =================
  const handleViewApplicants = async (job) => {
    try {
      setSelectedJob(job);
      const res = await getJobApplicationsApi(job._id);
      setApplicants(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = (appId, value) => {
    setApplicants((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: value } : a)),
    );
  };

  const updateStatus = async (appId, status) => {
    try {
      await updateApplicationStatusApi(appId, status);
      alert("Status updated");
    } catch {
      alert("Update failed");
    }
  };

  // ================= FILTER JOBS =================
  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "all" ? true : job.status === statusFilter;

    const jobTypeMatch =
      jobTypeFilter === "all" ? true : job.jobType === jobTypeFilter;

    return searchMatch && statusMatch && jobTypeMatch;
  });

  // ================= GET STARTED STEPS =================
  const step1 = true;
  const step2 = jobs.length > 0;
  const step3 = applicants.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-4xl font-bold">Company Job Portal</h1>

          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-teal-600 px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusCircle size={18} /> New Job
          </button>
        </div>
      </div>

      {/* GET STARTED CARD */}
      <div className="max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Get Started</h2>
            <p className="text-gray-500 mt-1">
              Complete these steps to start getting applicants.
            </p>
          </div>

          <button
            className="bg-teal-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setShowForm(true)}
          >
            Create Job
          </button>
        </div>

        <div className="flex gap-6 mt-5">
          <div className="flex items-center gap-2">
            {step1 ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
            )}
            <span>Complete your profile</span>
          </div>

          <div className="flex items-center gap-2">
            {step2 ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
            )}
            <span>Create your first job</span>
          </div>

          <div className="flex items-center gap-2">
            {step3 ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
            )}
            <span>Review applications</span>
          </div>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Job Postings</h2>

          {/* SEARCH + FILTER */}
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" />
              <input
                className="pl-10 pr-3 py-2 rounded-lg border border-gray-200"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="bg-white border border-gray-200 px-3 py-2 rounded-lg">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* FILTER OPTIONS */}
        <div className="flex gap-3 mt-4">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="border border-gray-200 rounded-lg px-3 py-2"
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
          >
            <option value="all">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* NO JOB CARD */}
        {jobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={40} className="text-gray-400" />
              <h3 className="text-xl font-bold">No Job Posting Yet</h3>
              <p className="text-gray-500">
                You haven’t created any job posts yet. Start by creating your
                first job.
              </p>
              <button
                className="bg-teal-500 text-white px-6 py-2 rounded-lg mt-3"
                onClick={() => setShowForm(true)}
              >
                Create Job Posting
              </button>
            </div>
          </div>
        )}

        {/* JOB CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {filteredJobs.map((job) => {
            const count = applicants.filter(
              (a) => a.job._id === job._id,
            ).length;

            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="p-5 flex flex-col h-full">
                  {/* TITLE + STATUS */}
                  <div className="flex justify-between items-start">
                    <div className="max-w-[70%]">
                      <h2 className="text-lg font-semibold line-clamp-1">
                        {job.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold mt-1
                        ${
                          job.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : job.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {job.status.toUpperCase()}
                    </span>
                  </div>

                  {/* ICON BADGES */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-800">
                      <Briefcase size={14} /> {job.jobType}
                    </span>

                    <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-800">
                      <MapPin size={14} /> {job.locationType}
                    </span>
                  </div>

                  {/* SKILLS */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.requiredSkills?.slice(0, 6).map((s, i) => (
                      <span
                        key={i}
                        className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* MBTI */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.preferredMbtiTypes?.slice(0, 6).map((m, i) => (
                      <span
                        key={i}
                        className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* APPLICANTS + ACTIONS */}
                  <div className="flex items-center justify-between mt-6 border-t pt-4">
                    {/* LEFT: APPLICANT COUNT + VIEW */}
                    <div className="flex items-center gap-4">
                      {/* COUNT BADGE */}
                      <div className="flex flex-col items-center justify-center  text-teal-500 px-4 py-2 rounded-xl">
                        <span className="text-2xl font-bold leading-none">
                          {job.applicantCount}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide">
                          Applicants
                        </span>
                      </div>

                      {/* VIEW BUTTON */}
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                      >
                        View Applicants
                      </button>
                    </div>

                    {/* RIGHT: EDIT + DELETE */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(job)}
                        disabled={job.status === "approved"}
                        className={`p-2 rounded-lg transition ${
                          job.status === "approved"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                        }`}
                        title="Edit Job"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(job._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* APPLICANTS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-xl">
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <p className="text-xl font-bold text-gray-500 mt-0.5">
                  {selectedJob.title}
                </p>
              </div>

              <X
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedJob(null)}
              />
            </div>

            {/* BODY */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {applicants.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  No applicants yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => (
                    <div
                      key={app._id}
                      className="border rounded-2xl p-5 hover:shadow-sm transition"
                    >
                      {/* TOP */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {app.applicant.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {app.applicant.email}
                          </p>
                          {/* MBTI BADGE */}
                          {app.applicant.mbtiType && (
                            <span
                              className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
    border border-teal-300 bg-teal-50 text-teal-700"
                            >
                              MBTI: {app.applicant.mbtiType}
                            </span>
                          )}
                          {/* SKILLS */}
                          {app.applicant.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {app.applicant.skills.map((s, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full text-xs font-medium
          border border-teal-300 bg-teal-50 text-teal-800"
                                >
                                  {s.skill} · {s.experienceLevel}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* STATUS BADGE */}
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold
                      ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : app.status === "reviewed"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-gray-100 text-gray-600"
                      }`}
                        >
                          {app.status.toUpperCase()}
                        </span>
                      </div>

                      {/* ACTION ROW */}
                      <div className="flex items-center justify-between mt-4">
                        {/* STATUS SELECT */}
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleStatusChange(app._id, e.target.value)
                          }
                          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>

                        <button
                          onClick={() => updateStatus(app._id, app.status)}
                          className="px-5 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <form
            className="bg-white w-full max-w-md p-6 rounded-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              saveJob();
            }}
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingJob ? "Edit Job" : "Create Job"}
              </h2>
              <X
                onClick={() => {
                  setShowForm(false);
                  setEditingJob(null);
                  setForm({
                    title: "",
                    description: "",
                    location: "",
                    locationType: "Remote",
                    jobType: "Full-time",
                    skills: [],
                    mbti: [],
                    skillInput: "",
                  });
                }}
                className="cursor-pointer"
              />
            </div>

            <input
              className="input"
              placeholder="Job Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              className="input mt-3"
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              className="input mt-3"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3 mt-3">
              <select
                className="input"
                value={form.locationType}
                onChange={(e) =>
                  setForm({ ...form, locationType: e.target.value })
                }
              >
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>

              <select
                className="input"
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

            <input
              className="input mt-3"
              placeholder="Skill + Enter"
              value={form.skillInput}
              onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {form.skills.map((s, i) => (
                <span
                  key={i}
                  className="bg-teal-100 px-3 py-1 rounded-full flex gap-1 items-center"
                >
                  <Star size={14} /> {s}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() =>
                      setForm({
                        ...form,
                        skills: form.skills.filter((sk) => sk !== s),
                      })
                    }
                  />
                </span>
              ))}
            </div>

            <select
              className="input mt-3"
              onChange={(e) => {
                const val = e.target.value;
                if (val && !form.mbti.includes(val)) {
                  setForm({ ...form, mbti: [...form.mbti, val] });
                }
              }}
            >
              <option value="">Select MBTI</option>
              {MBTI_TYPES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-2">
              {form.mbti.map((m, i) => (
                <span
                  key={i}
                  className="bg-green-100 px-3 py-1 rounded-full flex gap-1 items-center"
                >
                  <Target size={14} /> {m}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() =>
                      setForm({
                        ...form,
                        mbti: form.mbti.filter((x) => x !== m),
                      })
                    }
                  />
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="bg-teal-500 text-white w-full py-3 mt-5 rounded-xl"
            >
              {editingJob ? "Update Job" : "Save Job"}
            </button>
          </form>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
