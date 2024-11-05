import mongoose from 'mongoose';

const temporaryCompanySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
  otpExpiry: { type: Date, required: true },
});

const TemporaryCompany = mongoose.model('TemporaryCompany', temporaryCompanySchema);

export default TemporaryCompany;
