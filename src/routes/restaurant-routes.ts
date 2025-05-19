import { Router } from 'express';

import { RestaurantController } from '../controllers/restaurant-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use('/restaurants/random-draw', authenticate);
router.get('/restaurants/random-draw', RestaurantController.randomDraw);

router.use('/restaurants', authenticate);
router.patch('/restaurants', RestaurantController.edit);

router.post('/restaurants', RestaurantController.create);
router.get('/restaurants', RestaurantController.list);
router.get('/restaurants/:id', RestaurantController.find);

export default router;
