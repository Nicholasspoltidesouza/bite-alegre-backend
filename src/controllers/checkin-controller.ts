import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { CheckinService } from '../services/checkin-service.js';

export class CheckinController {
  static async create(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const restaurant_id = req.params.id;

      const checkin = await CheckinService.createCheckin({
        user_id,
        restaurant_id,
      });

      res.status(201).json(checkin);
    } catch (error) {
      console.error('Error creating checkin:', error);
      res.status(500).json({ error: 'Failed to create checkin' });
    }
  }
}
