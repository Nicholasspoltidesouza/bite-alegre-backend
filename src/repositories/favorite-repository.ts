import { PrismaClient, Favorite } from '@prisma/client';

import { CreateFavoriteDto } from '../dtos/favorite-dto.js';

const prisma = new PrismaClient();

export class FavoriteRepository {
  static async findFavorite(user_id: string, restaurant_id: string) {
    return prisma.favorite.findFirst({
      where: {
        user_id,
        restaurant_id,
      },
    });
  }

  static async create(data: CreateFavoriteDto): Promise<Favorite> {
    const { user_id, restaurant_id, time_at } = data;

    return prisma.favorite.create({
      data: {
        user_id,
        restaurant_id,
        time_at,
      },
    });
  }

  static async delete(favorite_id: string) {
    prisma.favorite.delete({
      where: {
        id: favorite_id,
      },
    });
  }

  static async findByUserId(
    userId: string,
  ): Promise<
    (Favorite & { restaurant: { name: string; profilePhoto: string | null } })[]
  > {
    return prisma.favorite.findMany({
      where: { user_id: userId },
      include: {
        restaurant: {
          select: { name: true, profilePhoto: true },
        },
      },
    });
  }
}
