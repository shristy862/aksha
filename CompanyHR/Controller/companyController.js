import bcrypt from 'bcryptjs';
import Company from '../modals/companyModel.js';
import { sendEmail } from '../../emailService.js';
import { verifyOtp } from '../../otpService.js';
import TemporaryCompany from '../modals/temporaryCompany.js';

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
      const existingCompany = await TemporaryCompany.findOne({ email });
      if (existingCompany) {
          return res.status(400).json({ message: 'OTP sent. Please check your email.' });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiry = Date.now() + 15 * 60 * 1000;

      await new TemporaryCompany({ email, otp, otpExpiry }).save();

      const subject = 'Requested OTP';
      const message = `Hello your Otp for verification is ${otp}`;

      await sendEmail(email, subject, message);

      res.status(201).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

export const createAccount = async (req, res) => {
  const { email, otp, password } = req.body; 

  try {
      const { isValid, type } = await verifyOtp(email, otp);

      if (!isValid || type !== 'company') {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newCompany = new Company({
          email,
          password: hashedPassword,
          userType: 'company',
      });
      await newCompany.save();

      await TemporaryCompany.deleteOne({ email });

      res.status(201).json({ message: 'Company registered successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};