import express from 'express';
import { addSuperHR } from '../Controller/addsuperHrController.js';
import { assignSuperHRToCompany } from '../Controller/assignSuperHRController.js';
import { getAllSuperHRs } from '../Controller/getAllSuperHrController.js';

const router = express.Router();

// Route to add a new Super HR
router.post('/add', addSuperHR);

// Route to assign a Super HR to a Company
router.post('/assign', assignSuperHRToCompany);

// Route to get all Super HRs
router.get('/all', getAllSuperHRs);

export default router;
