import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RestaurantTagRepository {
  static async create(restaurantId: string, tagId: string) {
    return prisma.restaurantTag.create({
      data: {
        restaurantId,
        tagId,
      },
    });
  }

  static async findByRestaurantId(restaurantId: string) {
    return prisma.restaurantTag.findMany({
      where: { restaurantId },
      select: { tagId: true },
    });
  }
}
