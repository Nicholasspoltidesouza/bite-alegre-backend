import { PrismaClient, Review } from '@prisma/client';

import { CreateReviewDto } from '../dtos/review-dto.js';

const prisma = new PrismaClient();

export class ReviewRepository {
  static async create(data: CreateReviewDto) {
    return prisma.review.create({
      data: {
        user_id: data.user_id,
        restaurant_id: data.restaurant_id,
        feedback: data.feedback,
        stars: data.stars,
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

  static async findByUserId(userId: string) {
    return prisma.review.findMany({
      where: { user_id: userId },
      include: {
        restaurant: {
          select: { name: true, profilePhoto: true },
        },
        user: {
          select: { name: true, profilePhoto: true },
        },
      },
    });
  }
}
