import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { FavoriteService } from '../services/favorite-service.js';

export class FavoritesController {
  static async createFavorite(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const restaurant_id = req.params.restaurant_id;

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

  static async deleteFavorite(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const restaurant_id = req.params.restaurant_id;

      await FavoriteService.deleteFavorite({
        user_id,
        restaurant_id,
      });

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting favorite:', error);
      res.status(500).json({ error: 'Failed to delete favorite' });
    }
  }
}
