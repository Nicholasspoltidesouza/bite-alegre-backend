import { Router } from 'express';

import { FeedController } from '../controllers/feed-controller.js';

const router = Router();
router.get('/feed/:id', FeedController.restaurantsOnFeed);

export default router;
