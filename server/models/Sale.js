import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    quantity: { type: Number, required: true },
    revenue: { type: Number, required: true },
    profit: { type: Number, required: true },
    location: { type: String, enum: ['STORE', 'DISPATCH'], required: true },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    soldAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Sale', saleSchema);
