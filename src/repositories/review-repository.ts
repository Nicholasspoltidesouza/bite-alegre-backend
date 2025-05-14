import { PrismaClient, Review } from '@prisma/client';

import { CreateReviewDto } from '../dtos/review-dto.js';

const prisma = new PrismaClient();

export class ReviewRepository {
  static async create(data: CreateReviewDto): Promise<Review> {
    const { user_id, restaurant_id, feedback, stars } = data;

    return prisma.review.create({
      data: {
        user_id,
        restaurant_id,
        feedback,
        stars,
      },
    });
  }

  static async findByRestaurantId(restaurantId: string): Promise<Review[]> {
    return prisma.review.findMany({
      where: {
        restaurant_id: restaurantId,
      },
    });
  }

  static async findByUserId(
    userId: string,
  ): Promise<
    (Review & { restaurant: { name: string; profilePhoto: string | null } })[]
  > {
    return prisma.review.findMany({
      where: { user_id: userId },
      include: {
        restaurant: {
          select: { name: true, profilePhoto: true },
        },
      },
    });
  }
}
