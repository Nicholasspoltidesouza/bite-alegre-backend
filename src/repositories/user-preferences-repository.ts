import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserPreferencesRepository {
  static async getUserPreferencesById(user_id: string) {
    return prisma.user_Preferences.findMany({ where: { user_id } });
  }

  static async create(user_id: string, tag_id: string, weight: number) {
    return prisma.user_Preferences.create({
      data: {
        user_id,
        tag_id,
        weight,
      },
    });
  }

  static async findRestaurantsByUserPreferences(userId: string) {
    const query = {
      where: { user_id: userId },
      include: {
        tag: true,
      },
    };

    return prisma.user_Preferences.findMany(query);
  }
}
