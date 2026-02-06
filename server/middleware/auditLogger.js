// server/middleware/auditLogger.js
const AuditLog = require("../models/AuditLog");

/**
 * logAudit - saves an admin action to the AuditLog collection
 * @param {Object} params
 * @param {String} params.adminId - ID of the admin performing the action
 * @param {String} params.action - Action type (e.g., 'DELETE_USER')
 * @param {String} [params.entity] - Entity affected (User, JobPost, etc.)
 * @param {String} [params.entityId] - ID of the affected entity
 * @param {String} [params.description] - Human-readable description of the action
 */
async function logAudit({ adminId, action, entity, entityId, description }) {
  try {
    const log = new AuditLog({
      admin: adminId,
      action,
      entity: entity || null,
      entityId: entityId || null,
      description: description || "",
    });
    await log.save();
  } catch (err) {
    console.error("❌ AUDIT LOG ERROR:", err.message);
  }
}

module.exports = { logAudit };
