import SuperHR from '../modals/superHrModal.js';
import Company from '../../CompanyHR/modals/companyModel.js'; 

export const assignSuperHRToCompany = async (req, res) => {
    const { companyId, superHRId } = req.body;

    try {
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const superHR = await SuperHR.findById(superHRId);
        if (!superHR) return res.status(404).json({ message: 'Super HR not found' });

        if (!superHR.assignedCompanies.includes(companyId)) {
            superHR.assignedCompanies.push(companyId);
            await superHR.save();
        }

        res.status(200).json({ message: 'Super HR assigned to company successfully', superHR });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
