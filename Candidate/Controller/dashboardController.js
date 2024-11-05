import Candidate from '../modals/candidateModal.js'; 

export const getCandidateDashboard = async (req, res) => {
    try {
        
        const candidate = await Candidate.findById(req.user.id).select('email userType'); 

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.status(200).json({
            message: `Welcome , ${candidate.userType}!`,
            credentials: {
                id: candidate._id,
                email: candidate.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};