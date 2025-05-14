import { Request, Response, NextFunction } from 'express';

import { verifyToken, JwtPayload } from '../utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token missing' });
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Bad authorization header' });
    return;
  }

  try {
    const payload = verifyToken(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
