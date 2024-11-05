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
        ref: 'Company', // Assuming you have a Company model
        required: true,
    },
    hiringManagerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HiringManager', // Assuming you have a HiringManager model
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    requirements: {
        type: [String], // Array of strings for job requirements
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
