import bcrypt from 'bcryptjs';
import { sendEmail } from '../../emailService.js';
import { verifyOtp } from '../../otpService.js';
import TemporaryUser from '../../userModal/temporaryUserModal.js';
import User from '../../userModal/modal.js';

export const sendOtp = async (req, res) => {
    const { email, userType } = req.body;
    console.log(req.body); 

  
    try {
      const existingUser = await TemporaryUser.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'OTP already sent. Please check your email.' });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiry = Date.now() + 15 * 60 * 1000;
  
      // Save temporary user 
      await new TemporaryUser({ email, otp, otpExpiry, userType }).save();
  
      const subject = 'Requested OTP';
      const message = `Hello, your OTP for verification is ${otp}`;
  
      await sendEmail(email, subject, message);
  
      res.status(201).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };  

// Create a new account after OTP verification
export const createAccount = async (req, res) => {
  const { email, otp, password, userType } = req.body;
    console.log(req.body);
  try {
      const { isValid } = await verifyOtp(email, otp);

      if (!isValid) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user 
      const newUser = new User({
          email,
          password: hashedPassword,
          userType: userType ,
          isVerified: true,  
      });

      await newUser.save();

      // Remove temporary user data 
      await TemporaryUser.deleteOne({ email });

      res.status(201).json({ message: `${userType} registered successfully` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};
