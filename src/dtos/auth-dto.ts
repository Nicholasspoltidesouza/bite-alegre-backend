import { Role } from '../utils/roles.js';

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  role: Role;
  user: { id: string; email: string };
}
