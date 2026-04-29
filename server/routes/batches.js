import express from 'express';
import Batch from '../models/Batch.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const batches = await Batch.find().populate('productId');
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const batch = new Batch(req.body);
        await batch.save();
        res.status(201).json(batch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id).populate('productId');
        if (!batch) return res.status(404).json({ message: 'Batch not found' });
        res.json(batch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!batch) return res.status(404).json({ message: 'Batch not found' });
        res.json(batch);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const batch = await Batch.findByIdAndDelete(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });
        res.json({ message: 'Batch deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
