import { Request, Response } from 'express';

import { RestaurantFilterDto } from '../dtos/restaurant-dto.js';
import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { PublicationService } from '../services/publication-service.js';

export class PublicationController {
  static async create(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const { description, restaurant_id } = req.body;
      const media = req.file;

      if (!media) {
        res.status(400).json({ error: 'Mídia não pode ser vazia!' });
        return;
      }

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

  static async find(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await PublicationService.getPostById(id);

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json(post);
    } catch (error) {
      console.error('Error finding one post:', error);
      res.status(500).json({ error: 'Failed to find post' });
    }
  }
  static async list(req: Request, res: Response) {
    const filters: RestaurantFilterDto = {
      name: req.query.name?.toString(),
      price_range: req.query.price_range
        ? Number(req.query.price_range)
        : undefined,
      tags: req.query.tags ? req.query.tags.toString().split(',') : undefined,
    };
    try {
      const { userId } = req.params;
      const data = await PublicationService.listByUser(filters, userId);
      if (data.length === 0) {
        res
          .status(404)
          .json({ message: 'No publications found for this user' });
      } else res.json(data);
    } catch (err) {
      console.error('Error listing publications:', err);
      res.status(500).json({
        error: err instanceof Error ? err.message : 'unexpected error',
      });
    }
  }
}
