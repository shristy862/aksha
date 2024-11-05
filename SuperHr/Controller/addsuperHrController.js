import SuperHR from '../modals/superHrModal.js';

export const addSuperHR = async (req, res) => {
    const { email, password } = req.body;

    try {
        const superHR = new SuperHR({ email, password });
        await superHR.save();
        res.status(201).json({ message: 'Super HR created successfully', superHR });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};