import { Request, Response } from 'express';

import { ReviewService } from '../services/review-service.js';

export class ReviewController {
  static async create(req: Request, res: Response) {
    try {
      const { user_id, stars, feedback } = req.body;
      const restaurant_id = req.params.id;

      const review = await ReviewService.createReview({
        user_id,
        restaurant_id,
        stars,
        feedback,
      });
      res.status(201).json(review);
    } catch (error) {
      console.error('Erro ao criar review:', error);
      res.status(500).json({ error: 'Falha ao criar review' });
    }
  }
}
