import mongoose from 'mongoose';

const stockAdjustmentSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    qtyChange: { type: Number, required: true },
    reason: { type: String, enum: ['DAMAGE', 'THEFT', 'EXPIRY', 'COUNT_ERROR'], required: true },
    location: { type: String, enum: ['STORE', 'DISPATCH'], required: true },
    adjustedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('StockAdjustment', stockAdjustmentSchema);
