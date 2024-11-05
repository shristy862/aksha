import HiringManager from '../modals/hiringManagerModal.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../../emailService.js'; 

export const addHiringManager = async (req, res) => {
    const { name, email, phone } = req.body; 
    const companyId = req.params.companyId; 
    try {
        
        const randomDigits = Math.floor(1000 + Math.random() * 9000);

        const generatedEmail = `${name.toLowerCase()}_${randomDigits}@company.com`;

        const generatedPassword = `Pass@${randomDigits}${Math.floor(1000 + Math.random() * 9000)}`;

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Create a new hiring manager with the generated email and hashed password
        const hiringManager = new HiringManager({ 
            name, 
            email: generatedEmail, 
            password: hashedPassword, 
            phone, 
            companyId 
        });
        await hiringManager.save();

        // Send the generated email and password to the provided email using Nodemailer
        const subject = 'Your Account Credentials';
        const message = `Hello ${name},\n\nYour account has been created!\n\nHere are your credentials:\nEmail: ${generatedEmail}\nPassword: ${generatedPassword}\n\nPlease keep this information secure.`;

        // Pass subject and text to sendEmail
        await sendEmail(email, subject, message);

        res.status(201).json({ 
            message: 'Hiring Manager created successfully and credentials sent via email', 
            hiringManager: {
                name,
                generatedEmail,
                phone,
                generatedPassword // Optional to include in response if needed for debugging
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
