import bcrypt from 'bcryptjs';
import TemporaryUser from '../../userModal/temporaryUserModal.js'; 
import User from '../../userModal/modal.js'; 
import { sendEmail } from '../../emailService.js';
import { verifyOtp } from '../../otpService.js';

export const sendOtp = async (req, res) => {
    const { email, userType } = req.body; // Extract userType from the request body
    console.log(req.body);
    try {
        // Check if the temporary user already exists
        const existingTempUser = await TemporaryUser.findOne({ email });
        if (existingTempUser) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        // Generate OTP and expiry time
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
        const otpExpiry = Date.now() + 15 * 60 * 1000; // Set expiry for 15 minutes
        console.log('Generated OTP:', otp);
        console.log('OTP Expiration Time:', new Date(otpExpiry).toISOString());

        // Create a new temporary user with the required fields
        const temporaryUser = new TemporaryUser({
            email,
            otp,
            otpExpiry,
            userType // Include userType here
        });

        await temporaryUser.save(); // Save the temporary user
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
    const { email, otp, password, userType } = req.body; 
    console.log('Received request for signup', req.body);
    try {
        // Use the verifyOtp function 
        const { isValid } = await verifyOtp(email, otp);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            isVerified: true,
            userType: userType, // Store the userType from the request
        });

        await newUser.save();

        // Remove temporary record 
        await TemporaryUser.deleteOne({ email });

        res.status(201).json({ message: 'Account created successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
