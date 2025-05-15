import { Router } from 'express';

import { FeedController } from '../controllers/feed-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/feed', authenticate);
router.get('/feed', FeedController.restaurantsOnFeed);

export default router;
