import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

// Soft pastel colors
const COLORS = [
  "#A5D8FF", // Soft Blue
  "#FFD6A5", // Soft Orange
  "#FFB3C1", // Soft Pink
  "#B9FBC0", // Soft Green
  "#E0BBE4", // Soft Purple
  "#FFDAC1", // Soft Peach
  "#C7CEEA", // Soft Lavender
];

// Extract top job per MBTI
const extractTopJobPerMbti = (jobTrends) => {
  const map = {};
  jobTrends.forEach((job) => {
    if (!job.mbtiStats || job.mbtiStats.length === 0) return;

    job.mbtiStats.forEach(({ mbti, count }) => {
      if (!map[mbti] || count > map[mbti].count) {
        map[mbti] = { jobTitle: job.jobTitle, count };
      }
    });
  });

  return Object.entries(map).map(([mbti, data], idx) => ({
    mbti,
    jobTitle: data.jobTitle,
    count: data.count,
    color: COLORS[idx % COLORS.length],
  }));
};

const MbtiBarChart = ({ jobTrends }) => {
  const dataSet = extractTopJobPerMbti(jobTrends);

  if (!dataSet.length) {
    return (
      <p className="text-center text-gray-500 py-10">
        No MBTI job trend data available.
      </p>
    );
  }

  const data = {
    labels: dataSet.map((d) => d.mbti),
    datasets: [
      {
        label: "Applicants",
        data: dataSet.map((d) => d.count),
        backgroundColor: dataSet.map((d) => d.color),
        borderRadius: 12,
        maxBarThickness: 60,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeOutCubic",
    },
    plugins: {
      tooltip: {
        backgroundColor: "#374151",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        callbacks: {
          label: (ctx) => {
            const { jobTitle, count } = dataSet[ctx.dataIndex];
            return `${count} applicants — ${jobTitle}`;
          },
        },
      },
      legend: { display: false },
      title: {
        display: true,
        text: "🌸 Top Job per MBTI (Soft Colors)",
        font: { size: 20, weight: "700" },
        color: "#374151",
        padding: { bottom: 20 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#4B5563", font: { weight: 500 } },
        grid: { color: "#E5E7EB" },
        title: { display: true, text: "MBTI Type", color: "#374151" },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: "#4B5563", font: { weight: 500 } },
        grid: { color: "#E5E7EB" },
        title: { display: true, text: "Applicants Count", color: "#374151" },
      },
    },
  };

  return (
    <div >
      <div className="h-[500px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default MbtiBarChart;
