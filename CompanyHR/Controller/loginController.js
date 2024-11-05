import bcrypt from 'bcryptjs';
import Company from '../modals/companyModel.js';  
import jwt from 'jsonwebtoken';

export const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        const company = await Company.findOne({ email });
        
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        console.log('Received Password:', password);
        console.log('Stored Hashed Password:', company.password);
        
        const isMatch = await bcrypt.compare(password, company.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!company.userType) {
            company.userType = 'company'; 
            await company.save();
        }

        const token = jwt.sign(
            { id: company._id, email: company.email },
            process.env.JWT_SECRET, 
            { expiresIn: '30m' } 
        );

        // Send response
        res.status(200).json({
            message: 'Login successful',
            userId: company._id,
            token, 
            userType: 'company'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
