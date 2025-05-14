import { Request, Response, NextFunction } from 'express';

import { Role } from '../utils/roles.js';

import { AuthenticatedRequest } from './authenticate.js';

export const restrictTo =
  (...allowed: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as AuthenticatedRequest;

    if (!user || !allowed.includes(user.role as Role)) {
      res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
