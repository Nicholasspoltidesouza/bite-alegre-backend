import jwt, { SignOptions, JwtPayload as LibJwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'RESTAURANT' | 'INFLUENCER';
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: '1h',
    issuer: 'bite-alegre-api',
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload & LibJwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload & LibJwtPayload;
}
