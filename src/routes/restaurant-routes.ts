import { Router } from 'express';

import { RestaurantController } from '../controllers/restaurant-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/restaurants/sort', authenticate);
router.get('/restaurants/sort', RestaurantController.sortRandom);

router.post('/restaurants', RestaurantController.create);
router.get('/restaurants', RestaurantController.list);
router.get('/restaurants/:id', RestaurantController.find);

export default router;
