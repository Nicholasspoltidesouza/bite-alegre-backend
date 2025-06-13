import { PrismaClient, User_Preferences } from '@prisma/client';

const prisma = new PrismaClient();

export class UserPreferencesRepository {
  static async getUserPreferencesByUserId(user_id: string) {
    return prisma.user_Preferences.findMany({ where: { user_id } });
  }

  static async findUserPreferencesById(id: string) {
    return prisma.user_Preferences.findUnique({
      where: { id },
    });
  }

  static async findUserPreferences(tag_id: string, user_id: string) {
    return prisma.user_Preferences.findFirst({ where: { tag_id, user_id } });
  }

  static async deleteUserPreference(
    UserPreference: User_Preferences,
  ): Promise<void> {
    await prisma.user_Preferences.delete({
      where: {
        id: UserPreference.id,
      },
    });
  }

  static async addWeigh(UserPreference: User_Preferences): Promise<void> {
    await prisma.user_Preferences.update({
      where: {
        id: UserPreference.id,
      },
      data: {
        weight: {
          increment: 1,
        },
      },
    });
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
