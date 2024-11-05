import express from 'express';
import { sendOtp, createAccount } from '../Controller/companyController.js';
import { loginCompany } from '../Controller/loginController.js'; 
import { getCompanyDashboard } from '../Controller/dashboardController.js'; 
import { authenticateToken } from '../../Middleware/verifyToken.js';
import { completeCompanyProfile } from '../Controller/profileController.js';

const router = express.Router();

// Route to send OTP
router.post('/signup', (req, res, next) => {
    console.log('Received request to send OTP');
    next();
}, sendOtp);
// Route to create a company account after verifying OTP
router.post('/create-account', createAccount);
// Route to login
router.post('/login', loginCompany);
// Route to dashboard
router.get('/dashboard', authenticateToken, getCompanyDashboard);
// Route to complete profile
router.put('/dashboard/:id/complete-profile',authenticateToken, completeCompanyProfile);

export default router;
