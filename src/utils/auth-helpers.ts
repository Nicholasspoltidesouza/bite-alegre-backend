import { Request } from 'express';

import { AuthenticatedRequest } from '../middlewares/authenticate.js';

export function extractUserIdIfAuthenticated(req: Request): string | undefined {
  try {
    const authUser = (req as AuthenticatedRequest).user;
    return authUser?.role === 'USER' || authUser?.role === 'INFLUENCER'
      ? authUser.sub
      : undefined;
  } catch {
    return undefined;
  }
}
