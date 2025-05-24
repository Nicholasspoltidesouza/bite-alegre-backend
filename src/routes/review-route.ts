import { Router } from 'express';

import { ReviewController } from '../controllers/review-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/restaurants/:id/review', authenticate);
router.post('/restaurants/:id/review', ReviewController.create);

export default router;
