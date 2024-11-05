import bcrypt from 'bcryptjs';
import Candidate from '../modals/candidateModal.js';
import TemporaryCandidate from '../modals/temporaryM.js';
import { sendEmail } from '../../emailService.js';
import { verifyOtp } from '../../otpService.js';

export const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        console.log('Received email:', email);

        // Check if the candidate already exists 
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        // Generate OTP and expiry time
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + 15 * 60 * 1000;
        console.log('Generated OTP:', otp);
        console.log('OTP Expiration Time:', new Date(otpExpiry).toISOString());

        
        let temporaryCandidate = await TemporaryCandidate.findOne({ email });

        if (temporaryCandidate) {
            // Update the existing 
            temporaryCandidate.otp = otp;
            temporaryCandidate.otpExpiry = otpExpiry;
            await temporaryCandidate.save();
            console.log('Updated OTP for existing temporary candidate:', temporaryCandidate);
        } else {
            // Create a new record 
            temporaryCandidate = await new TemporaryCandidate({ email, otp, otpExpiry }).save();
            console.log('Temporary candidate saved:', temporaryCandidate);
        }

        // Send OTP 
        // await sendEmail(email, otp);
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
    const { email, otp, password, } = req.body;
    console.log('Received request for signup', req.body);
    try {
        // Use the verifyOtp function to validate the OTP
        const { isValid, tempRecord } = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCandidate = new Candidate({
            email,
            password: hashedPassword,
            isVerified: true,
            userType: 'candidate',
        });

        await newCandidate.save();

        // Remove temporary record 
        await TemporaryCandidate.deleteOne({ email });

        res.status(201).json({ message: 'Account created successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
