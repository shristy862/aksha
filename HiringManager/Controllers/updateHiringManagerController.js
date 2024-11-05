import HiringManager from '../modals/hiringManagerModal.js';

export const updateHiringManager = async (req, res) => {
    const { id } = req.params;
    const { name, phone } = req.body;

    try {
        const hiringManager = await HiringManager.findById(id);
        if (!hiringManager) return res.status(404).json({ message: 'Hiring Manager not found' });

        if (name) hiringManager.name = name;
        if (phone) hiringManager.phone = phone;

        await hiringManager.save();
        res.status(200).json({ message: 'Hiring Manager updated successfully', hiringManager });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
