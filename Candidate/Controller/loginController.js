import bcrypt from 'bcryptjs';
import Candidate from '../modals/candidateModal.js'; 
import jwt from 'jsonwebtoken';

export const loginCandidate = async (req, res) => {
    const { email, password } = req.body;

    try {
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token 
        const token = jwt.sign(
            { id: candidate._id, email: candidate.email },
            process.env.JWT_SECRET, 
            { expiresIn: '30m' } 
        );

        // Update the userType 
        if (!candidate.userType) {
            candidate.userType = 'candidate'; 
            await candidate.save();
        }

        // Send response 
        res.status(200).json({
            message: `Login Successfull`,  
            userId: candidate._id,           
            token,                            
            userType: candidate.userType    
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};