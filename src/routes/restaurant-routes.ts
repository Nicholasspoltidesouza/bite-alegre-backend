import { Router } from 'express';

import { RestaurantController } from '../controllers/restaurant-controller.js';

const router = Router();

router.post('/restaurants', RestaurantController.create);
router.get('/restaurants', RestaurantController.list);
router.get('/restaurants/:id', RestaurantController.find);

export default router;
