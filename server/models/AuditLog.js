const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      // examples: approve_job, reject_job, delete_job
    },

    targetType: {
      type: String,
      required: true,
      // examples: JobPost, User, MBTIQuestion
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true, // ✅ gives createdAt & updatedAt automatically
  },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
