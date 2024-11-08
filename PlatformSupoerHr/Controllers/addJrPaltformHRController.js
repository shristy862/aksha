import bcrypt from 'bcryptjs';
import User from '../../userModal/modal.js';

export const addPlatformHRByPlatformSuperHR = async (req, res) => {
    try {
        const { platformSuperHRid } = req.params;
        const { name, email, password } = req.body;

        console.log('PlatformSuperHRId from params =>', platformSuperHRid); 

        const platformSuperHR = await User.findById(platformSuperHRid).select('userType');
        if (!platformSuperHR || platformSuperHR.userType !== 'platformSuperHR') {
            return res.status(403).json({ message: 'Access denied. Only PlatformSuperHR can add PlatformHR.' });
        }

        const existingHR = await User.findOne({ email });
        if (existingHR) {
            return res.status(400).json({ message: 'A PlatformHR with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the PlatformHR
        const platformHR = new User({
            name,
            email,
            password: hashedPassword,
            userType: 'platformHR',
            addedBy: platformSuperHRid,
        });

        await platformHR.save();

        res.status(201).json({
            message: 'PlatformHR created successfully by PlatformSuperHR',
            platformHR: {
                id: platformHR._id,
                name: platformHR.name,
                email: platformHR.email,
                userType: platformHR.userType,
                addedBy: platformHR.addedBy, 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
