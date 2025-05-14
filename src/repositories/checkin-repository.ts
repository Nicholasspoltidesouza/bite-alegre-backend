import { PrismaClient, Checkin } from '@prisma/client';

import { CreateCheckinDto } from '../dtos/checkin-dto.js';

const prisma = new PrismaClient();

export class CheckinRepository {
  static async findCheckin(user_id: string, restaurant_id: string) {
    return prisma.checkin.findFirst({
      where: {
        user_id,
        restaurant_id,
      },
    });
  }

  static async create(data: CreateCheckinDto): Promise<Checkin> {
    const { user_id, restaurant_id, time_at } = data;

    return prisma.checkin.create({
      data: {
        user_id,
        restaurant_id,
        time_at,
      },
    });
  }
  static async findByUserId(
    userId: string,
  ): Promise<
    (Checkin & { restaurant: { name: string; profilePhoto: string | null } })[]
  > {
    return prisma.checkin.findMany({
      where: { user_id: userId },
      include: {
        restaurant: {
          select: { name: true, profilePhoto: true },
        },
      },
    });
  }
}
