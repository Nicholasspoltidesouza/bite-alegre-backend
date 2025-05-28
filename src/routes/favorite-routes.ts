import { Router } from 'express';

import { FavoritesController } from '../controllers/favorite-controller.js';

const router = Router();

router.post(
  '/users/save-restaurant/:restaurant_id',
  FavoritesController.createFavorite,
);

export default router;
