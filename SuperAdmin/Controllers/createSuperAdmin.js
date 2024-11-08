import bcrypt from 'bcryptjs';
import User from '../../userModal/modal.js';
import { sendEmail } from '../../emailService.js';

export const createSuperAdmin = async (req, res) => {
  const { name, password, recipientEmail } = req.body;

  try {
    // Clean and process the name to ensure no whitespace
    const cleanedName = name.replace(/\s+/g, '').toLowerCase(); // removes all spaces and converts to lowercase
    const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
    const generatedEmail = `${cleanedName}${randomFourDigits}@company.com`;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new SuperAdmin user
    const superAdminUser = new User({
      email: generatedEmail,
      password: hashedPassword,
      userType: 'superadmin',
      isVerified: true,
    });

    await superAdminUser.save();

    const subject = 'Your SuperAdmin Account Credentials';
    const message = `
      Hello ${name},

      Your SuperAdmin account has been created with the following credentials:

      Email: ${generatedEmail}
      Password: ${password}

      Please log in and change your password upon first access.

      Best regards,
      Your Company
    `;

    await sendEmail(recipientEmail, subject, message);

    res.status(201).json({ message: 'SuperAdmin created, credentials sent via email', generatedEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
