// import Company from '../modals/companyModel.js';

export const getCompanyDashboard = async (req, res) => {
    try {
        const company = await Company.findById(req.user.id).select('email userType');

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({
            message: `Welcome ${company.userType}!`,
            company: {
                id: company._id,
                email: company.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
