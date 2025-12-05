const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: String,
    userName: String,
    action: { type: String, required: true },
    details: String,
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
