import { Router } from 'express';

import { UserController } from '../controllers/user-controller.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/users', UserController.create);
router.get('/users', UserController.list);
router.get('/users/:id', UserController.find);
router.patch('/users', authenticate, UserController.update);

export default router;
