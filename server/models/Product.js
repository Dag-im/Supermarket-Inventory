import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    barcode: String,
    name: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    subCategory: String,
    unit: { type: String, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    minStockStore: { type: Number, default: 10 },
    minStockDispatch: { type: Number, default: 5 },
    isPerishable: { type: Boolean, default: false },
    defaultExpiryDays: { type: Number, default: 0 },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
