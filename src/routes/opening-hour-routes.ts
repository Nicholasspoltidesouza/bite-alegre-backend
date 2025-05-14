import { Router } from 'express';

import { OpeningHourController } from '../controllers/opening-hour-controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { restrictTo } from '../middlewares/roles.js';
import { Role } from '../utils/roles.js';

const router = Router();

router.get('/restaurants/:id/opening-hours', OpeningHourController.list);

router.post(
  '/restaurant/opening-hours',
  authenticate,
  restrictTo(Role.RESTAURANT),
  OpeningHourController.createPeriod,
);

router.put(
  '/restaurant/opening-hours/:periodId',
  authenticate,
  restrictTo(Role.RESTAURANT),
  OpeningHourController.updatePeriod,
);

router.delete(
  '/restaurant/opening-hours/:periodId',
  authenticate,
  restrictTo(Role.RESTAURANT),
  OpeningHourController.deletePeriod,
);

export default router;
