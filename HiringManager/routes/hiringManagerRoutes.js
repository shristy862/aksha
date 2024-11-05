import express from 'express';
import { addHiringManager } from '../Controllers/addHiringManagerController.js';
import { updateHiringManager } from '../Controllers/updateHiringManagerController.js';
import { deactivateHiringManager } from '../Controllers/deactivateHiringManagerController.js';
import { authenticateToken} from '../../Middleware/verifyToken.js';
import { loginHiringManager } from '../Controllers/loginHmController.js';
import { postJob } from '../Controllers/postJobController.js';

const router = express.Router();
// route to add HM
router.post('/:companyId/add', authenticateToken, addHiringManager);
// route to update HM
router.put('/:id/update', updateHiringManager);
// route to deactivate HM
router.put('/:id/deactivate', deactivateHiringManager);
// login HM
router.post('/login', loginHiringManager);
// route to post jobs
router.post('/:companyId/jobs', authenticateToken, postJob);

export default router;
