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
}
