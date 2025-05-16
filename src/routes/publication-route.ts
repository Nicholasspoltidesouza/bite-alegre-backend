import { Router } from 'express';

import { PublicationController } from '../controllers/publication-controller.js';

const router = Router();

router.post('/publicacoes', PublicationController.create);

export default router;
