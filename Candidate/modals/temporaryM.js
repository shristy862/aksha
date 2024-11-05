import mongoose from 'mongoose';

const temporaryCandidateSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
  otpExpiry: { type: Date, required: true },
});

export default mongoose.model('TemporaryCandidate', temporaryCandidateSchema);
