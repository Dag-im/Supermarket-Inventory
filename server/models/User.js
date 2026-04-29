import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['OWNER', 'STORE_MANAGER', 'DISPATCH_MANAGER'],
        required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    lastLogin: Date
}, { timestamps: true });

export default mongoose.model('User', userSchema);
