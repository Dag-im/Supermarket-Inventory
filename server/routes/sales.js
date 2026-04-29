import express from 'express';
import Sale from '../models/Sale.js';
import Batch from '../models/Batch.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('productId')
            .populate('batchId')
            .populate('soldBy', 'name email');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { batchId, quantity } = req.body;

        const batch = await Batch.findById(batchId);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        if (batch.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        batch.quantity -= quantity;
        await batch.save();

        const sale = new Sale(req.body);
        await sale.save();

        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
