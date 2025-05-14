import bcrypt from 'bcrypt';

import { LoginRequestDto, LoginResponseDto } from '../dtos/auth-dto.js';
import { AuthRepository } from '../repositories/auth-repository.js';
import { signToken } from '../utils/jwt.js';
import { Role } from '../utils/roles.js';

function buildResponse(
  id: string,
  email: string,
  role: Role,
): LoginResponseDto {
  return {
    token: signToken({ sub: id, email, role }),
    role,
    user: { id, email },
  };
}

export class AuthService {
  static async login(input: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = input;

    const user = await AuthRepository.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const role = user.influencer ? Role.INFLUENCER : Role.USER;
      return buildResponse(user.id, user.email, role);
    }

    const rest = await AuthRepository.findRestaurantByEmail(email);
    if (rest && (await bcrypt.compare(password, rest.password))) {
      return buildResponse(rest.id, rest.email, Role.RESTAURANT);
    }

    throw new Error('Invalid credentials');
  }
}
