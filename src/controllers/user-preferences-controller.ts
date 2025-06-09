import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
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

  static async deletePreference(req: Request, res: Response) {
    const { sub: user_id } = (req as AuthenticatedRequest).user;
    const { user_preference_id } = req.params;
    try {
      await UserPreferencesService.deletePreference(
        user_id,
        user_preference_id,
      );

      res.status(200).json({
        message: 'Preferência deletada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar a preferência do usuário:', error);
      res
        .status(500)
        .json({ error: 'Erro ao deletar a preferência do usuário' });
    }
  }

  static async addWeigh(req: Request, res: Response) {
    const { sub: user_id } = (req as AuthenticatedRequest).user;
    const { user_preference_id } = req.params;
    try {
      await UserPreferencesService.addWeigh(user_id, user_preference_id);

      res.status(200).json({
        message: 'Peso da preferência incrementado',
      });
    } catch (error) {
      console.error('Erro ao aumentar peso da preferência do usuário:', error);
      res
        .status(500)
        .json({ error: 'Erro ao ao aumentar peso da preferência do usuário' });
    }
  }
}
