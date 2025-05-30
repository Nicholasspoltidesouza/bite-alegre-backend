import { Request, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { UserService } from '../services/user-service.js';

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const {
        profilePhoto,
        name,
        nickname,
        email,
        password,
        phone,
        gender,
        birthDate,
        tagIds,
        influencer,
      } = req.body;

      const user = await UserService.createUser({
        profilePhoto,
        name,
        nickname,
        email,
        password,
        phone,
        gender,
        birthDate,
        tagIds,
        influencer,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  static async update(req: Request, res: Response) {
    const { sub: userId } = (req as AuthenticatedRequest).user;
    const { profilePhoto, name, nickname, email, phone, birthDate, tagIds } =
      req.body;

    try {
      const updatedUser = await UserService.updateUser(userId, {
        profilePhoto,
        name,
        nickname,
        email,
        phone,
        birthDate,
        tagIds,
      });

      res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ error: 'Erro interno ao editar perfil' });
    }
  }

  static async list(req: Request, res: Response) {
    const nickname = String(req.query.nickname || '');
    try {
      let users;

      users = await UserService.filterByUsersByNickname(nickname);

      res.status(200).json(users);
    } catch (error) {
      console.error('Error looking for user:s', error);
      res.status(500).json({ error: 'Failed to search users' });
    }
  }

  static async find(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error finding one user:', error);
      res.status(500).json({ error: 'Failed to find user' });
    }
  }
}
