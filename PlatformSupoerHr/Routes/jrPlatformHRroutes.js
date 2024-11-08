import express from 'express';
import { addPlatformHRByPlatformSuperHR } from '../Controllers/addJrPaltformHRController.js';
import { authenticateToken } from '../../Middleware/verifyToken.js';

const router = express.Router();

// Route for PlatformSuperHR to add PlatformHR
router.post('/:platformSuperHRid/addplatformHR', authenticateToken, addPlatformHRByPlatformSuperHR);

export default router;
