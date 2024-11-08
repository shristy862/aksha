import bcrypt from 'bcryptjs';
import TemporaryUser from '../temporaryUserModal.js'; 
import User from '../modal.js'; 
import { sendEmail } from '../../emailService.js';
import { verifyOtp } from '../../otpService.js';

export const sendOtp = async (req, res) => {
    const { email, password, userType } = req.body;
    console.log(req.body);

    try {
        // Check if the temporary user exists
        const existingTempUser = await TemporaryUser.findOne({ email });
        if (existingTempUser) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        // Generate OTP 
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        const otpExpiry = Date.now() + 5 * 60 * 1000; // Set expiry for 5 minutes
        console.log('Generated OTP:', otp);
        console.log('OTP Expiration Time:', new Date(otpExpiry).toISOString());

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new temporary user 
        const temporaryUser = new TemporaryUser({
            email,
            password: hashedPassword, 
            otp,
            otpExpiry,
            userType 
        });

        await temporaryUser.save(); 
        console.log('Temporary user saved:', temporaryUser);

        // Send OTP to the user's email
        const subject = 'Requested OTP';
        const message = `Hello, your OTP for verification is ${otp}`;
        await sendEmail(email, subject, message);

        res.status(201).json({ message: 'OTP sent to your email. Please verify to complete signup.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createAccount = async (req, res) => {
    const { email, otp } = req.body; // Only email and OTP
    console.log('Received request for signup', req.body);

    try {
        // Use the verifyOtp function to check if OTP is valid
        const { isValid } = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Retrieve the temporary user by email
        const temporaryUser = await TemporaryUser.findOne({ email });
        if (!temporaryUser) {
            return res.status(400).json({ message: 'No temporary user found for this email.' });
        }

        // Create a new user in the main User collection with the hashed password
        const newUser = new User({
            email,
            password: temporaryUser.password, // Use the pre-hashed password
            isVerified: true,  // Mark as verified
            userType: temporaryUser.userType, // Store the userType from the temporary record
        });

        await newUser.save(); // Save the user
        console.log('New user created:', newUser);

        // Remove the temporary user record after successful signup
        await TemporaryUser.deleteOne({ email });

        res.status(201).json({ message: 'Account created successfully!' });

    } catch (error) {
        console.error('Error in createAccount:', error);
        res.status(500).json({ message: 'Server error' });
    }
};