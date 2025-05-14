import { Router } from 'express';

import { ReviewController } from '../controllers/review-controller.js';

const router = Router();

router.post('/restaurants/:id/review', ReviewController.create);

export default router;
