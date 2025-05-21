import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { PublicationService } from '../services/publication-service.js';

export class PublicationController {
  static async create(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const { description, restaurant_id } = req.body;
      if (!req.file) {
        res.status(400).json({ error: 'Mídia não pode ser vazia!' });
        return;
      }
      const media = req.file;
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
      console.error(
        'Error creating publication: ',
        JSON.stringify(error, null, 2),
      );
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Erro inesperado',
      });
    }
  }
  static async listByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const data = await PublicationService.listByUser(userId);
      if (data.length === 0) {
        res
          .status(404)
          .json({ message: 'No publications found for this user' });
      }
      res.json(data);
    } catch (err) {
      console.error('Error listing publications:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'unexpected error',
      });
    }
  }
}
