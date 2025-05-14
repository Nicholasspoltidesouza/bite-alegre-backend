import { Request, Response } from 'express';

import { FeedService } from '../services/feed-service.js';

export class FeedController {
  static async restaurantsOnFeed(req: Request, res: Response) {
    try {
      // const { sub: id } = (req as AuthenticatedRequest).user;
      const { id } = req.params;
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
        id,
        latitude,
        longitude,
        proximity,
      );

      res.status(200).json(restaurants);
    } catch (error) {
      console.error('Error finding restaurants:', error);
      res.status(500).json({ error: 'Failed to find restaurants' });
    }
  }
}
