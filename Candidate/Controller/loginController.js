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

        // Generate a JWT token with a 30-minute expiration time
        const token = jwt.sign(
            { id: candidate._id, email: candidate.email },
            process.env.JWT_SECRET, 
            { expiresIn: '30m' } 
        );

        // Update the userType in the database if it is not already set
        if (!candidate.userType) {
            candidate.userType = 'candidate'; // Set the user type to candidate
            await candidate.save(); // Save the updated candidate
        }

        // Send response with the welcome message, user ID, and token
        res.status(200).json({
            message: `Login Successfull`,  // Welcome message
            userId: candidate._id,           // User ID
            token,                            // JWT token
            userType: candidate.userType      // User type from the database
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};