import { Gender } from '@prisma/client';
import bcrypt from 'bcrypt';

import { prisma } from './test-helpers.js';

export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  nickname: string;
  influencer?: boolean;
}

export interface TestRestaurant {
  id: string;
  email: string;
  password: string;
  name: string;
  cnpj: string;
}

export async function createTestUser(
  overrides: Partial<TestUser> = {},
): Promise<TestUser> {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);

  const defaultUser = {
    email: `test-${timestamp}-${randomId}@example.com`,
    password: 'password123',
    name: 'Test User',
    nickname: `testuser-${timestamp}-${randomId}`,
    phone: '11999999999',
    gender: Gender.NAO_QUERO_INFORMAR,
    birthDate: new Date('1990-01-01'),
    influencer: false,
  };

  const userData = { ...defaultUser, ...overrides };
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
    password: userData.password,
    name: user.name,
    nickname: user.nickname,
  };
}

export async function createTestRestaurant(
  overrides: Partial<TestRestaurant> = {},
): Promise<TestRestaurant> {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);

  const defaultRestaurant = {
    email: `restaurant-${timestamp}-${randomId}@example.com`,
    password: 'password123',
    name: 'Test Restaurant',
    cnpj: `${timestamp}${randomId}`.substring(0, 14).padEnd(14, '0'),
    address: 'Test Address, 123',
    phone: '11999999999',
  };

  const restaurantData = { ...defaultRestaurant, ...overrides };
  const hashedPassword = await bcrypt.hash(restaurantData.password, 10);

  const restaurant = await prisma.restaurant.create({
    data: {
      ...restaurantData,
      password: hashedPassword,
    },
  });

  return {
    id: restaurant.id,
    email: restaurant.email,
    password: restaurantData.password,
    name: restaurant.name,
    cnpj: restaurant.cnpj,
  };
}

export async function createAuthToken(
  userId: string,
  role: 'USER' | 'RESTAURANT' | 'INFLUENCER' = 'USER',
): Promise<string> {
  const { signToken } = await import('../../src/utils/jwt.js');
  const { Role } = await import('../../src/utils/roles.js');

  const roleMap = {
    USER: Role.USER,
    RESTAURANT: Role.RESTAURANT,
    INFLUENCER: Role.INFLUENCER,
  };

  return signToken({
    sub: userId,
    email: 'test@example.com',
    role: roleMap[role],
  });
}
