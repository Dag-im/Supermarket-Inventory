import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    requestedQty: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'FULFILLED', 'REJECTED'], default: 'PENDING' },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedAt: { type: Date, default: Date.now },
    fulfilledAt: Date
}, { timestamps: true });

export default mongoose.model('Transfer', transferSchema);
