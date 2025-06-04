import { Request, Response } from 'express';

import { LoginRequestDto } from '../dtos/auth-dto.js';
import { AuthService } from '../services/auth-service.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const body = req.body as LoginRequestDto;

      if (!body.email || !body.password) {
        res.status(400).json({ error: 'email and password required' });
        return;
      }

      const result = await AuthService.login(body);
      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
}
