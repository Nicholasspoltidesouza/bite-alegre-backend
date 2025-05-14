import { Router } from 'express';

import { UserPreferencesController } from '../controllers/user-preferences-controller.js';

const router = Router();

router.get(
  '/user_preferences/:user_id',
  UserPreferencesController.listByUserId,
);

router.post('/user_preferences', UserPreferencesController.create);

export default router;
