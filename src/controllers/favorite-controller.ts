import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { FavoriteService } from '../services/favorite-service.js';

export class FavoritesController {
  static async createFavorite(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const { restaurant_id } = req.params;

      const favorite = await FavoriteService.createFavorite({
        user_id,
        restaurant_id,
      });

      res.status(201).json(favorite);
    } catch (error) {
      console.error('Error saving restaurant:', error);
      res.status(500).json({ error: 'Failed to save restaurant' });
    }
  }
}
