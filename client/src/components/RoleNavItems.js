export default function getNavItems(role) {
  const common = [
    { to: "/", label: "Home" },
    { to: "/mbti-test", label: "MBTI Test" },
    { to: "/result", label: "My Results" },
    { to: "/jobresult", label: "Jobs" },
  ];

  if (!role || role === "jobseeker") {
    return [
      { to: "/", label: "Home" },
      { to: "/mbti-test", label: "MBTI Test" },
      { to: "/jobresult", label: "Jobs" },
      { to: "/myapplication", label: "My Applications" },
      { to: "/result", label: "MBTI / Career" },
      { to: "/profile", label: "Profile" },
    ];
  }

  if (role === "company") {
    return [
      { to: "/", label: "Home" },
      { to: "/companyportal", label: "Dashboard" },
      { to: "/companyportal#post-job", label: "Post Job" },
      { to: "/companyportal#my-jobs", label: "My Jobs" },
      { to: "/companyportal#applications", label: "Applications" },
      { to: "/profile", label: "Company Profile" },
    ];
  }

  if (role === "admin") {
    return [
      { to: "/", label: "Home" },
      { to: "/admin", label: "Dashboard" },
      { to: "/admin#users", label: "User Management" },
      { to: "/admin#companies", label: "Company Management" },
      { to: "/admin#jobs", label: "Job Management" },
      { to: "/admin#reports", label: "Reports" },
    ];
  }

  return common;
}
