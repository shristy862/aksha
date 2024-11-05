import express from 'express';
import { addHiringManager } from '../Controllers/addHiringManagerController.js';
import { updateHiringManager } from '../Controllers/updateHiringManagerController.js';
import { deactivateHiringManager } from '../Controllers/deactivateHiringManagerController.js';
import { authenticateToken} from '../../Middleware/verifyToken.js';
import { loginHiringManager } from '../Controllers/loginHmController.js';
import { postJob } from '../Controllers/postJobController.js';

const router = express.Router();

router.post('/:companyId/add', authenticateToken, addHiringManager);
router.put('/:id/update', updateHiringManager);
router.put('/:id/deactivate', deactivateHiringManager);
router.post('/login', loginHiringManager);
router.post('/:companyId/jobs', authenticateToken, postJob);

export default router;
