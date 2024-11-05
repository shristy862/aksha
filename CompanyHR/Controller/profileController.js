// import Company from '../modals/companyModel.js';

export const completeCompanyProfile = async (req, res) => {
    const { 
        phoneNo,
        location,
        websiteUrl,
        industryType,
        companySize,
        representative,
        registrationNumber,
        gstNumber
    } = req.body;

    try {
        console.log("Received Request to complete profile with user ID:", req.user.id);

        // Find the company by the ID extracted from the token
        const company = await Company.findById(req.user.id);
        
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        console.log('Received data:', req.body);

        // Update profile fields
        company.phoneNo = phoneNo || company.phoneNo;
        company.location = location || company.location;
        company.websiteUrl = websiteUrl || company.websiteUrl;
        company.industryType = industryType || company.industryType;
        company.companySize = companySize || company.companySize;
        company.representative = representative || company.representative;
        company.registrationNumber = registrationNumber || company.registrationNumber;
        company.gstNumber = gstNumber || company.gstNumber;

        // Save updated profile
        await company.save();

        res.status(200).json({ message: 'Company profile updated successfully', company });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
