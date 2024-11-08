import bcrypt from 'bcryptjs';
import User from '../../userModal/modal.js';

export const addPlatformSuperHR = async (req, res) => {
    try {
        const { superAdminId } = req.params;
        console.log('SuperAdminId from params =>', superAdminId); // Debugging line
        const { name, email, password } = req.body; 

        // Check if the requesting user is a superadmin
        const superAdmin = await User.findById(superAdminId).select('userType');
        if (!superAdmin || superAdmin.userType !== 'superadmin') {
            return res.status(403).json({ message: 'Access denied. Only SuperAdmin can add PlatformHR.' });
        }

        // Check if a PlatformHR already exists with the given email
        const existingHR = await User.findOne({ email });
        if (existingHR) {
            return res.status(400).json({ message: 'A PlatformSuperHR with this email already exists.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the PlatformHR
        const platformHR = new User({
            name,
            email,
            password: hashedPassword,
            userType: 'platformSuperHR',
            addedBy:  superAdminId,
        });

        await platformHR.save();

        res.status(201).json({
            message: 'PlatformSuperHR created successfully',
            platformHR: {
                id: platformHR._id,
                name: platformHR.name,
                email: platformHR.email,
                userType: platformHR.userType
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
