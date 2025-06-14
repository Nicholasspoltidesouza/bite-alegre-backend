import { Request, Response } from 'express';

import {
  OpeningPeriodDto,
  OpeningPeriodsDto,
} from '../dtos/opening-hour-dto.js';
import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { OpeningHourService } from '../services/opening-hour-service.js';

export class OpeningHourController {
  static async createPeriod(req: Request, res: Response) {
    try {
      const { sub: restaurantId } = (req as AuthenticatedRequest).user;
      const body = req.body as OpeningPeriodsDto;

      if (!Array.isArray(body)) {
        throw new Error('Request body must be an array of periods.');
      }

      const created = await OpeningHourService.addPeriods(restaurantId, body);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: (err as Error).message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const { restId } = req.params;
      const hours = await OpeningHourService.listByRestaurant(restId);
      res.status(200).json(hours);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: (err as Error).message });
    }
  }

  static async updatePeriod(req: Request, res: Response) {
    try {
      const { sub: restaurantId } = (req as AuthenticatedRequest).user;
      const { periodId } = req.params;
      const body = req.body as OpeningPeriodDto;

      const updated = await OpeningHourService.updatePeriod(
        restaurantId,
        periodId,
        body,
      );
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: (err as Error).message });
    }
  }

  static async deletePeriod(req: Request, res: Response) {
    try {
      const { sub: restaurantId } = (req as AuthenticatedRequest).user;
      const { periodId } = req.params;

      await OpeningHourService.deletePeriod(restaurantId, periodId);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: (err as Error).message });
    }
  }
}
