import { Router } from 'express';

import { CheckinController } from '../controllers/checkin-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use('/restaurants/:id/checkin', authenticate);
router.post('/restaurants/:id/checkin', CheckinController.create);

export default router;
