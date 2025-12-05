const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

// Get all audit logs
router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new audit log
router.post('/', async (req, res) => {
    const log = new AuditLog(req.body);
    try {
        const newLog = await log.save();
        res.status(201).json(newLog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
