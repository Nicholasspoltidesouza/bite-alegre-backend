import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { FeedService } from '../services/feed-service.js';
import { PublicationService } from '../services/publication-service.js';

export class FeedController {
  static async restaurantsOnFeed(req: Request, res: Response) {
    try {
      const { sub: user_id } = (req as AuthenticatedRequest).user;
      const prox = req.query.proximity as string;
      const proximity = prox ? parseFloat(prox) : undefined;

      let latitude: number | undefined;
      let longitude: number | undefined;

      if (req.query.geolocation) {
        const geo = req.query.geolocation.toString().split(',').map(Number);
        if (geo.length === 2 && !geo.some(isNaN)) {
          [latitude, longitude] = geo;
        } else {
          res
            .status(400)
            .json({ error: 'Invalid geolocation format. Use "lat,long"' });
        }
      }
      const restaurants = await FeedService.restaurantsOnFeed(
        user_id,
        latitude,
        longitude,
        proximity,
      );

      const publications =
        await PublicationService.listByRestaurant(restaurants);

      res.status(200).json({ restaurants, publications });
    } catch (error) {
      console.error('Error finding restaurants:', error);
      res.status(500).json({ error: 'Failed to find restaurants' });
    }
  }
}
