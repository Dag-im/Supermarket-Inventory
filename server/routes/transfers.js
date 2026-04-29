import express from 'express';
import Transfer from '../models/Transfer.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const transfers = await Transfer.find()
            .populate('productId')
            .populate('requestedBy', 'name email');
        res.json(transfers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const transfer = new Transfer(req.body);
        await transfer.save();
        res.status(201).json(transfer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id/fulfill', async (req, res) => {
    try {
        const transfer = await Transfer.findByIdAndUpdate(
            req.params.id,
            { status: 'FULFILLED', fulfilledAt: new Date() },
            { new: true }
        );
        if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
        res.json(transfer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const transfer = await Transfer.findByIdAndDelete(req.params.id);
        if (!transfer) return res.status(404).json({ message: 'Transfer not found' });
        res.json({ message: 'Transfer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
