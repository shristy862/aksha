import mongoose from 'mongoose';

const HiringManagerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('HiringManager', HiringManagerSchema);
