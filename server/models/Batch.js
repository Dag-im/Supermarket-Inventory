import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    batchNo: { type: String, required: true },
    receivedDate: { type: Date, required: true },
    expiryDate: Date,
    quantity: { type: Number, required: true },
    location: { type: String, enum: ['STORE', 'DISPATCH'], required: true },
    costPerUnit: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Batch', batchSchema);
