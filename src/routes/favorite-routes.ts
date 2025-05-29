import { Router } from 'express';

import { FavoritesController } from '../controllers/favorite-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use('/users/save-restaurant/:restaurant_id', authenticate);
router.post(
  '/users/save-restaurant/:restaurant_id',
  FavoritesController.createFavorite,
);

export default router;
