import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: { 
        type: String, 
        enum: ['company', 'other'], 
        required: true 
    },
    phoneNo: { type: String }, // Phone number
    location: {
        streetAddress: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
    },
    websiteUrl: { type: String },
    industryType: { type: String },
    companySize: { type: String },
    representative: {
        name: { type: String },
        position: { type: String },
    },
    registrationNumber: { type: String },
    gstNumber: { type: String },
}, { timestamps: true });

export default mongoose.model('Company', CompanySchema);
