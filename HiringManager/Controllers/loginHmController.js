import HiringManager from '../modals/hiringManagerModal.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginHiringManager = async (req, res) => {
    const { email, password } = req.body;
    console.log('Received Login Credentials for HM',req.body);
    try {
        const hiringManager = await HiringManager.findOne({ email });
        
        if (!hiringManager) {
            return res.status(404).json({ message: 'Hiring Manager not found' });
        }

        console.log('Received Password:', password);
        console.log('Stored Hashed Password:', hiringManager.password);
        
        const isMatch = await bcrypt.compare(password, hiringManager.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!hiringManager.userType) {
            hiringManager.userType = 'hiringManager';
            await hiringManager.save();
        }

        const token = jwt.sign(
            { id: hiringManager._id, email: hiringManager.email },
            process.env.JWT_SECRET, 
            { expiresIn: '30m' } 
        );

        res.status(200).json({
            message: 'Login successful',
            userId: hiringManager._id,
            token, 
            userType: 'hiringManager'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
