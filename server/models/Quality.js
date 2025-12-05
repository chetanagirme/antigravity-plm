const mongoose = require('mongoose');

const ncrSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    description: String,
    productId: String,
    supplierId: String,
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    status: { type: String, enum: ['Open', 'Investigating', 'Resolved', 'Closed'], default: 'Open' },
    reportedBy: String,
    images: [String]
}, { timestamps: true });

const capaSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    ncrId: String, // Linked NCR
    title: { type: String, required: true },
    description: String,
    rootCause: String,
    correctiveAction: String,
    preventiveAction: String,
    status: { type: String, enum: ['Draft', 'Open', 'Implemented', 'Verified', 'Closed'], default: 'Draft' },
    assignedTo: String,
    dueDate: Date
}, { timestamps: true });

module.exports = {
    NCR: mongoose.model('NCR', ncrSchema),
    CAPA: mongoose.model('CAPA', capaSchema)
};
