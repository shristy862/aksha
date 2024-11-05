import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', 
        required: true,
    },
    hiringManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HiringManager', 
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    requirements: {
        type: [String], 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
