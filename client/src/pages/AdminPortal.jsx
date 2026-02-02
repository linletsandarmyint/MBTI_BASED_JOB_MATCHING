import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Briefcase,
  HelpCircle,
  CheckCircle,
  XCircle,
  Archive,
  Search,
  Edit,
  Trash2,
  Ban,
  Eye,
  PlusCircle,
} from "lucide-react";

import {
  getAdminDashboardStats,
  getAdminUsers,
  toggleUserStatus,
  deleteUserAdmin,
  getAdminJobs,
  toggleJobArchive,
  deleteJobAdmin,
  getJobById,
  getAdminMbtiQuestions,
  createMbtiQuestions,
  updateMbtiQuestion,
  toggleMbtiQuestionStatus,
  deleteMbtiQuestion,
  approveJobAdmin,
  rejectJobAdmin,
  getAdminAuditLogs,
  
} from "../api/adminApi";

export default function AdminPortal() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  // User state
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // Job state
  const [jobs, setJobs] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatus, setJobStatus] = useState("");

  // Job modal
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // MBTI state
  const [mbtiQuestions, setMbtiQuestions] = useState([]);
  const [mbtiModal, setMbtiModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { text: "", value: "E" },
    { text: "", value: "I" },
  ]);

  // audit log
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch Overview
  useEffect(() => {
    const fetchOverview = async () => {
      const res = await getAdminDashboardStats();
      setStats(res.data);
    };
    fetchOverview();
  }, []);

  // Fetch Users
  useEffect(() => {
    if (activeTab !== "users") return;

    const fetchUsers = async () => {
      const res = await getAdminUsers(search, role, status);
      setUsers(res.data);
    };
    fetchUsers();
  }, [activeTab, search, role, status]);

  // Fetch Jobs
  useEffect(() => {
    if (activeTab !== "job posts") return;

    const fetchJobs = async () => {
      const res = await getAdminJobs(jobSearch, jobStatus);
      setJobs(res.data);
    };

    fetchJobs();
  }, [activeTab, jobSearch, jobStatus]);

  // Fetch MBTI Questions
  useEffect(() => {
    if (activeTab !== "mbti questions") return;

    const fetchMbti = async () => {
      const res = await getAdminMbtiQuestions();
      setMbtiQuestions(res.data.questions);
    };

    fetchMbti();
  }, [activeTab]);

  // Fetch Audit Logs
  useEffect(() => {
    if (activeTab !== "audit log") return;

    const fetchAuditLogs = async () => {
      const res = await getAdminAuditLogs();
      setAuditLogs(res.data.logs);
    };

    fetchAuditLogs();
  }, [activeTab]);
const actionConfig = {
  APPROVE_JOB: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "from-green-100 to-emerald-100",
  },
  REJECT_JOB: {
    icon: XCircle,
    color: "text-red-600",
    bg: "from-red-100 to-pink-100",
  },
  DELETE_USER: {
    icon: Trash2,
    color: "text-red-700",
    bg: "from-red-100 to-orange-100",
  },
  UPDATE: {
    icon: Edit,
    color: "text-blue-600",
    bg: "from-blue-100 to-cyan-100",
  },
  DEFAULT: {
    icon: Archive,
    color: "text-gray-600",
    bg: "from-gray-100 to-slate-100",
  },
};
  // User actions
  const handleToggleUser = async (id) => {
    await toggleUserStatus(id);
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)),
    );
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUserAdmin(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  // Job actions
  const handleToggleJob = async (id) => {
    await toggleJobArchive(id);
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, isActive: !j.isActive } : j)),
    );
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await deleteJobAdmin(id);
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  const handleOpenJobDetails = async (id) => {
    const res = await getJobById(id);
    setSelectedJob(res.data.job);
    setShowModal(true);
  };

  const handleApproveJob = async (id) => {
    await approveJobAdmin(id);
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, status: "approved" } : j)),
    );
  };

  const handleRejectJob = async (id) => {
    await rejectJobAdmin(id);
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, status: "rejected" } : j)),
    );
  };

  // MBTI actions
  const handleOpenMbtiModal = (question = null) => {
    setEditingQuestion(question);
    if (question) {
      setQuestionText(question.question);
      setOptions(question.options);
    } else {
      setQuestionText("");
      setOptions([
        { text: "", value: "E" },
        { text: "", value: "I" },
      ]);
    }
    setMbtiModal(true);
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { text: "", value: "E" }]);
  };

  const handleOptionChange = (index, key, value) => {
    const newOptions = [...options];
    newOptions[index][key] = value;
    setOptions(newOptions);
  };

  const handleSaveMbtiQuestion = async () => {
    if (!questionText.trim()) {
      alert("Question text is required.");
      return;
    }

    const data = { question: questionText, options };

    if (editingQuestion) {
      const res = await updateMbtiQuestion(editingQuestion._id, data);
      setMbtiQuestions((prev) =>
        prev.map((q) =>
          q._id === editingQuestion._id ? res.data.question : q,
        ),
      );
    } else {
      const res = await createMbtiQuestions(data);
      setMbtiQuestions((prev) => [res.data.question, ...prev]);
    }

    setMbtiModal(false);
  };

  const handleToggleMbti = async (id) => {
    await toggleMbtiQuestionStatus(id);
    setMbtiQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, isActive: !q.isActive } : q)),
    );
  };

  const handleDeleteMbti = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await deleteMbtiQuestion(id);
    setMbtiQuestions((prev) => prev.filter((q) => q._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-10 text-center">
        <h1 className="text-3xl font-bold">Admin Control Center</h1>
        <p className="text-sm opacity-90 mt-2">
          Manage users, job posts, and MBTI content
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview */}
        <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <OverviewCard
            icon={Users}
            title="Users"
            total={stats?.users?.total}
            items={[
              {
                icon: CheckCircle,
                label: "Active",
                value: stats?.users?.active,
                color: "text-green-600",
              },
              {
                icon: XCircle,
                label: "Deactivated",
                value: stats?.users?.deactivated,
                color: "text-red-500",
              },
            ]}
          />

          <OverviewCard
            icon={Building2}
            title="Companies"
            total={stats?.companies?.total}
            items={[
              {
                icon: CheckCircle,
                label: "Active",
                value: stats?.companies?.active,
                color: "text-green-600",
              },
              {
                icon: XCircle,
                label: "Deactivated",
                value: stats?.companies?.deactivated,
                color: "text-red-500",
              },
            ]}
          />

          <OverviewCard
            icon={Briefcase}
            title="Job Posts"
            total={stats?.jobs?.total}
            items={[
              {
                icon: CheckCircle,
                label: "Active",
                value: stats?.jobs?.active,
                color: "text-green-600",
              },
              {
                icon: Archive,
                label: "Archived",
                value: stats?.jobs?.archived,
                color: "text-gray-500",
              },
            ]}
          />

          <OverviewCard
            icon={HelpCircle}
            title="MBTI Questions"
            total={stats?.mbti?.questions}
            items={[]}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <Tab
            label="Users"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <Tab
            label="Job Posts"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <Tab
            label="MBTI Questions"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <Tab
            label="Audit Log"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* USERS */}
        {activeTab === "users" && (
          <UserManagement
            users={users}
            setSearch={setSearch}
            setRole={setRole}
            setStatus={setStatus}
            handleToggleUser={handleToggleUser}
            handleDeleteUser={handleDeleteUser}
          />
        )}

        {/* JOBS */}
        {activeTab === "job posts" && (
          <JobManagement
            jobs={jobs}
            setJobSearch={setJobSearch}
            setJobStatus={setJobStatus}
            handleToggleJob={handleToggleJob}
            handleDeleteJob={handleDeleteJob}
            handleOpenJobDetails={handleOpenJobDetails}
            handleApproveJob={handleApproveJob}
            handleRejectJob={handleRejectJob}
          />
        )}

        {/* MBTI QUESTIONS */}
        {activeTab === "mbti questions" && (
          <MBTIManagement
            mbtiQuestions={mbtiQuestions}
            handleOpenMbtiModal={handleOpenMbtiModal}
            handleToggleMbti={handleToggleMbti}
            handleDeleteMbti={handleDeleteMbti}
          />
        )}

        {/* AUDIT LOG */}
        {activeTab === "audit log" && <AuditLog logs={auditLogs} />}
      </div>

      {/* Job Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-11/12 md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Job Details</h3>
              <button onClick={() => setShowModal(false)}>X</button>
            </div>

            <h2 className="font-bold text-xl mb-2">{selectedJob.title}</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {selectedJob.location}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                {selectedJob.jobType}
              </span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                {selectedJob.locationType}
              </span>
              <span
                className={`px-3 py-1 rounded-full ${
                  selectedJob.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedJob.isActive ? "Active" : "Archived"}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              {selectedJob.description}
            </p>

            <div className="mb-2 font-semibold">Required Skills:</div>
            <div className="flex flex-wrap gap-2">
              {selectedJob.requiredSkills?.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MBTI Modal */}
      {mbtiModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-11/12 md:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                {editingQuestion ? "Edit Question" : "Add Question"}
              </h3>
              <button onClick={() => setMbtiModal(false)}>X</button>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Question Text</label>
              <input
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter question text"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Options (Dimension)</label>
                <button
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg"
                  onClick={handleAddOption}
                >
                  <PlusCircle size={16} /> Add Option
                </button>
              </div>

              {options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    value={opt.text}
                    onChange={(e) =>
                      handleOptionChange(idx, "text", e.target.value)
                    }
                    className="w-2/3 border rounded-lg px-3 py-2"
                    placeholder="Option text"
                  />
                  <select
                    value={opt.value}
                    onChange={(e) =>
                      handleOptionChange(idx, "value", e.target.value)
                    }
                    className="w-1/3 border rounded-lg px-3 py-2"
                  >
                    <option value="E">E</option>
                    <option value="I">I</option>
                    <option value="S">S</option>
                    <option value="N">N</option>
                    <option value="T">T</option>
                    <option value="F">F</option>
                    <option value="J">J</option>
                    <option value="P">P</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100"
                onClick={() => setMbtiModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-teal-500 text-white"
                onClick={handleSaveMbtiQuestion}
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

const OverviewCard = ({ icon: Icon, title, total, items }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 rounded-lg bg-teal-100 text-teal-600">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{total || 0}</p>
      </div>
    </div>

    {items.length > 0 && (
      <div className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-gray-600">
            <item.icon size={16} className={item.color} />
            <span>
              {item.value || 0} {item.label}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const Tab = ({ label, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(label.toLowerCase())}
    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
      activeTab === label.toLowerCase()
        ? "bg-teal-500 text-white"
        : "bg-white border"
    }`}
  >
    {label}
  </button>
);

const IconBtn = ({ icon: Icon, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition ${
      danger
        ? "bg-red-50 text-red-600 hover:bg-red-100"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    <Icon size={18} />
  </button>
);

const UserManagement = ({
  users,
  setSearch,
  setRole,
  setStatus,
  handleToggleUser,
  handleDeleteUser,
}) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">User Management</h2>

    <div className="flex flex-wrap gap-3 mb-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          placeholder="Search name or email"
          className="pl-10 pr-4 py-2 border rounded-lg text-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="border rounded-lg px-3 py-2 text-sm"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="jobseeker">Job Seeker</option>
        <option value="company">Company</option>
        <option value="admin">Admin</option>
      </select>

      <select
        className="border rounded-lg px-3 py-2 text-sm"
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="deactivated">Deactivated</option>
      </select>
    </div>

    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="px-4 py-3">{u.name}</td>
              <td className="text-center">{u.email}</td>
              <td className="text-center">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {u.role}
                </span>
              </td>
              <td className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    u.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.isActive ? "active" : "deactivated"}
                </span>
              </td>
              <td className="text-center">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="flex justify-center gap-2 py-3">
                <IconBtn icon={Edit} />
                <IconBtn icon={Ban} onClick={() => handleToggleUser(u._id)} />
                <IconBtn
                  icon={Trash2}
                  danger
                  onClick={() => handleDeleteUser(u._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const JobManagement = ({
  jobs,
  setJobSearch,
  setJobStatus,
  handleToggleJob,
  handleDeleteJob,
  handleOpenJobDetails,
  handleApproveJob,
  handleRejectJob,
}) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Job Post Management</h2>

    <div className="flex gap-3 mb-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          placeholder="Search job title"
          className="pl-10 pr-4 py-2 border rounded-lg text-sm"
          onChange={(e) => setJobSearch(e.target.value)}
        />
      </div>

      <select
        className="border rounded-lg px-3 py-2 text-sm"
        onChange={(e) => setJobStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>

      <button className="bg-teal-500 text-white px-4 py-2 rounded-lg">
        Search
      </button>
    </div>

    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th>Company</th>
            <th>JobPost Status</th>
            <th>JobPost Visibility</th>
            <th>Created</th>
            <th>Applicants</th>
            <th className="text-center w-40 ">Approval/Actions</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-t">
              <td className=" px-3 py-2">{job.title}</td>
              <td className="text-center">{job.company?.name || "Company"}</td>
              <td className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : job.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {job.isActive ? "Active" : "Archived"}
                </span>
              </td>
              <td className="text-center">
                {new Date(job.createdAt).toLocaleDateString()}
              </td>
              <td className="text-center">{job.applicantCount || 0}</td>

              <td className="flex gap-6 px-3 py-3">
                {/* APPROVAL ICONS */}
                <div className="flex gap-4">
                  <IconBtn
                    icon={CheckCircle}
                    onClick={() => handleApproveJob(job._id)}
                  />
                  <IconBtn
                    icon={XCircle}
                    onClick={() => handleRejectJob(job._id)}
                  />
                </div>

                <div className="w-[2px] h-6 bg-gray-200" />

                {/* ACTION ICONS */}
                <div className="flex gap-4 ">
                  <IconBtn
                    icon={job.isActive ? Archive : CheckCircle}
                    onClick={() => handleToggleJob(job._id)}
                  />
                  <IconBtn
                    icon={Trash2}
                    danger
                    onClick={() => handleDeleteJob(job._id)}
                  />
                  <IconBtn
                    icon={Eye}
                    onClick={() => handleOpenJobDetails(job._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MBTIManagement = ({
  mbtiQuestions,
  handleOpenMbtiModal,
  handleToggleMbti,
  handleDeleteMbti,
}) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">MBTI Questions</h2>

      <button
        className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg"
        onClick={() => handleOpenMbtiModal(null)}
      >
        <PlusCircle size={18} />
        Add Question
      </button>
    </div>

    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left">Order</th>
            <th className="px-4 py-3 text-left">Question</th>
            <th className="text-center">Dimension</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mbtiQuestions.map((q, idx) => (
            <tr key={q._id} className="border-t">
              <td className="px-4 py-3 font-medium">{idx + 1}</td>
              <td className="text-left">{q.question}</td>

              <td className="text-center">
                <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-green-100 text-teal-700 text-xs font-semibold">
                  {q.options.map((o) => o.value).join(" / ")}
                </span>
              </td>

              <td className="text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    q.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {q.isActive ? "Active" : "Archived"}
                </span>
              </td>

              <td className="flex justify-center gap-2 py-3">
                <IconBtn icon={Edit} onClick={() => handleOpenMbtiModal(q)} />
                <IconBtn
                  icon={q.isActive ? Archive : CheckCircle}
                  onClick={() => handleToggleMbti(q._id)}
                />
                <IconBtn
                  icon={Trash2}
                  danger
                  onClick={() => handleDeleteMbti(q._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AuditLog = ({ logs }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold">Audit Log</h2>
      <span className="text-sm text-gray-500">
        {logs.length} record{logs.length === 1 ? "" : "s"}
      </span>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {logs.map((log) => (
        <div
          key={log._id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-start gap-4 hover:shadow-md transition"
        >
          {/* ICON BOX */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100">
            <Archive size={20} className="text-teal-600" />
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800">
                {log.action.replaceAll("_", " ").toUpperCase()}
              </h3>
              <span className="text-xs text-gray-400">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">{log.description}</p>

            <div className="text-xs text-gray-500 mt-2 flex gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                Target: {log.targetType}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                ID: {log.targetId}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {logs.length === 0 && (
      <div className="text-center py-10 text-gray-500">No audit logs yet.</div>
    )}
  </div>
);
