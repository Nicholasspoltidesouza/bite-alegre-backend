import { Request, Response } from 'express';

import { UserPreferencesService } from '../services/user-preferences-service.js';

export class UserPreferencesController {
  static async listByUserId(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      const tags = await UserPreferencesService.getUserPreferences(
        user_id as string,
      );
      res.status(200).json(tags);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({ error: 'Failed to fetch user preferences' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { user_id, tag_id, weight } = req.body;

      const user = await UserPreferencesService.createUserPreferences(
        user_id,
        tag_id,
        weight,
      );

      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
}
