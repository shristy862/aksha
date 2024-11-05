import HiringManager from '../modals/hiringManagerModal.js';

export const deactivateHiringManager = async (req, res) => {
    const { id } = req.params;

    try {
        const hiringManager = await HiringManager.findById(id);
        if (!hiringManager) return res.status(404).json({ message: 'Hiring Manager not found' });

        hiringManager.isActive = false;
        await hiringManager.save();

        res.status(200).json({ message: 'Hiring Manager deactivated successfully', hiringManager });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
