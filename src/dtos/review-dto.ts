import { Review } from '@prisma/client';

export interface CreateReviewDto {
  stars: number;
  user_id: string;
  restaurant_id: string;
  feedback?: string;
}

export class ReviewOutputDto {
  id: string;
  stars: string;
  restaurant_id: string;
  feedback?: string | null;
  createdAt: Date;
  userId: string;

  constructor(data: ReviewOutputDto) {
    this.id = data.id;
    this.stars = data.stars;
    this.restaurant_id = data.restaurant_id;
    this.feedback = data.feedback;
    this.createdAt = data.createdAt;
    this.userId = data.userId;
  }

  static fromEntity(entity: Review): ReviewOutputDto {
    return new ReviewOutputDto({
      id: entity.id,
      stars: entity.stars.toString(),
      restaurant_id: entity.restaurant_id,
      feedback: entity.feedback,
      createdAt: entity.createdAt,
      userId: entity.user_id,
    });
  }

  static fromEntities(entities: Array<Review>): ReviewOutputDto[] {
    return entities.map(ReviewOutputDto.fromEntity);
  }
}
