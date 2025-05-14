import { PrismaClient, User, Restaurant } from '@prisma/client';
const prisma = new PrismaClient();

export class AuthRepository {
  static findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  static findRestaurantByEmail(email: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({ where: { email } });
  }
}
