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

  constructor(data: ReviewOutputDto) {
    this.id = data.id;
    this.stars = data.stars;
    this.restaurant_id = data.restaurant_id;
    this.feedback = data.feedback;
  }

  static fromEntity(entity: Review): ReviewOutputDto {
    return new ReviewOutputDto({
      id: entity.id,
      stars: entity.stars.toString(),
      restaurant_id: entity.restaurant_id,
      feedback: entity.feedback,
    });
  }

  static fromEntities(entities: Review[]): ReviewOutputDto[] {
    return entities.map(ReviewOutputDto.fromEntity);
  }
}
