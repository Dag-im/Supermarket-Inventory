import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import batchRoutes from './routes/batches.js';
import supplierRoutes from './routes/suppliers.js';
import transferRoutes from './routes/transfers.js';
import saleRoutes from './routes/sales.js';
import auditLogRoutes from './routes/auditLogs.js';
import stockAdjustmentRoutes from './routes/stockAdjustments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/stock-adjustments', stockAdjustmentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Inventory Management API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
