import { Router } from 'express';

import { RestaurantController } from '../controllers/restaurant-controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload, uploadRestaurantUpdate } from '../middlewares/upload.js';

const router = Router();

router.get(
  '/restaurants/random-draw',
  authenticate,
  RestaurantController.randomDraw,
);

router.patch(
  '/restaurants',
  authenticate,
  uploadRestaurantUpdate,
  RestaurantController.edit,
);

router.post(
  '/restaurants',
  upload.array('menuMedias'),
  RestaurantController.create,
);
router.get('/restaurants', RestaurantController.list);
router.get('/restaurants/:id', RestaurantController.find);
router.get('/restaurants-tags', authenticate, RestaurantController.getTags);
router.delete(
  '/restaurants/menu-items/:item_id',
  authenticate,
  RestaurantController.deleteDish,
);

export default router;
