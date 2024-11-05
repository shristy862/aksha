import mongoose from 'mongoose';

const SuperHRSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    assignedCompanies: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company' 
    }],
    privileges: { 
        type: String, 
        default: 'super_hr', 
        enum: ['super_hr']
    }
}, { timestamps: true });

export default mongoose.model('SuperHR', SuperHRSchema);