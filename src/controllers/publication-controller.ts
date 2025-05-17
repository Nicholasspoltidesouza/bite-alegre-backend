import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { PublicationService } from '../services/publication-service.js';

export class PublicationController {
  static async create(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const { description, restaurant_id, media } = req.body;
      const publication = await PublicationService.create(
        {
          description,
          restaurant_id,
          media,
        },
        user_id,
      );
      res.status(201).json(publication);
    } catch (error) {
      console.error('Error creating publication: ', error);
      res.status(500).json({ error: 'Failed to fetch publication' });
    }
  }
}
