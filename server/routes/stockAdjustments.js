import express from 'express';
import StockAdjustment from '../models/StockAdjustment.js';
import Batch from '../models/Batch.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const adjustments = await StockAdjustment.find()
            .populate('productId')
            .populate('batchId')
            .populate('adjustedBy', 'name email');
        res.json(adjustments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { batchId, qtyChange } = req.body;

        const batch = await Batch.findById(batchId);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        batch.quantity += qtyChange;
        if (batch.quantity < 0) batch.quantity = 0;
        await batch.save();

        const adjustment = new StockAdjustment(req.body);
        await adjustment.save();

        res.status(201).json(adjustment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
