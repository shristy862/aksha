import express from 'express';
import { createSuperAdmin } from '../Controllers/createSuperAdmin.js';
import { verifySecurityCode } from '../../Middleware/verifySecurityCode.js';
import { loginSuperAdmin } from '../Controllers/loginController.js';
import { authenticateToken } from '../../Middleware/verifyToken.js';
import { superAdminDashboard } from '../Controllers/dashboardController.js';
import { addPlatformSuperHR } from '../Controllers/addplatformHRController.js';

const router = express.Router();
// Route for creating superAdmin
router.post('/create-superadmin', verifySecurityCode, createSuperAdmin);
// Route for SuperAdmin login 
router.post('/login-superadmin', loginSuperAdmin);
// Route for SuperAdmin Dashboard
router.get('/superadmin/dashboard', authenticateToken, superAdminDashboard);
//  Route for adding platformSuperHr
router.post('/:superAdminId/addplatformSuperHR', authenticateToken, addPlatformSuperHR);
export default router;
