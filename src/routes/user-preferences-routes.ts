import { Router } from 'express';

import { UserPreferencesController } from '../controllers/user-preferences-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get(
  '/user_preferences/:user_id',
  UserPreferencesController.listByUserId,
);
router.delete(
  '/user_preferences/:user_preference_id',
  authenticate,
  UserPreferencesController.deletePreference,
);
router.patch(
  '/user_preferences/add_weigh/:tag_id',
  authenticate,
  UserPreferencesController.addWeigh,
);

router.post('/user_preferences', UserPreferencesController.create);

export default router;
