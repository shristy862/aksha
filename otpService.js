import TemporaryCandidate from './Candidate/modals/temporaryM.js';
import TemporaryCompany from './CompanyHR/modals/temporaryCompany.js'; 

export const verifyOtp = async (email, otp, expiryTime) => {
  const tempCandidate = await TemporaryCandidate.findOne({ email });
  const tempCompany = await TemporaryCompany.findOne({ email });

  // Check for OTP verification for both Candidate and Company
  if (tempCandidate) {
    return {
      isValid: tempCandidate.otp === parseInt(otp) && tempCandidate.otpExpiry >= Date.now(),
      tempRecord: tempCandidate,
      type: 'candidate',
    };
  }

  if (tempCompany) {
    return {
      isValid: tempCompany.otp === parseInt(otp) && tempCompany.otpExpiry >= Date.now(),
      tempRecord: tempCompany,
      type: 'company',
    };
  }

  return { isValid: false, type: null };
};
