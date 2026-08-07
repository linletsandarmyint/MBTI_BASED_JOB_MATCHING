// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mbtibasedjobmatching.vercel.app",
    ], // React (Vite)
    credentials: true,
  }),
);

// ✅ MUST be before routes
app.use(express.json());

// // ===== ROUTES =====
 const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
 const mbtiRoutes = require("./routes/mbtiRoutes");
 const jobRoutes = require("./routes/jobRoutes");
const skillRoutes = require("./routes/skillRoutes");
 const aiRoutes = require("./routes/aiRoutes");
 const analyticsRoutes = require("./routes/analyticsRoutes");
// // Mount routes
 app.use("/api/auth", authRoutes);
 app.use("/api/admin", adminRoutes);
 app.use("/api/mbti", mbtiRoutes);
 app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/ai", aiRoutes);
 app.use("/api/analytics", analyticsRoutes);
// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "MBTI Based Job Matching API is running 🚀",
  });
});

// ❗ GLOBAL ERROR HANDLER (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR HANDLER");
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
