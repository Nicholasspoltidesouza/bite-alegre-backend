import { Router } from 'express';

import { PublicationController } from '../controllers/publication-controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.post(
  '/post',
  authenticate,
  upload.single('media'),
  PublicationController.create,
);

router.get('/post/:userId', authenticate, PublicationController.listByUser);

export default router;
