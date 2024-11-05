import { Router } from 'express';
import { sendOtp, createAccount } from '../Controller/candidateController.js';
import { loginCandidate } from '../Controller/loginController.js';
import { getCandidateDashboard } from '../Controller/dashboardController.js';
import { authenticateToken } from '../../Middleware/verifyToken.js';

const router = Router();

// Route for sending OTP 
router.post('/signup', sendOtp);

// Route for creating a candidate account after OTP verification
router.post('/create-account', createAccount);

// Route for login 
router.post('/login' , loginCandidate);

// Route for dashboard
router.get('/dashboard', authenticateToken, getCandidateDashboard);

export default router;
