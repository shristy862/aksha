import SuperHR from '../modals/superHrModal.js';

export const getAllSuperHRs = async (req, res) => {
    try {
        const superHRs = await SuperHR.find();
        res.status(200).json({ superHRs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};