import express from 'express';
import AuditLog from '../models/AuditLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const log = new AuditLog(req.body);
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
