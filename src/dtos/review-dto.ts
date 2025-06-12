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
  userName: string;
  userProfilePhoto?: string | null;

  constructor(data: ReviewOutputDto) {
    this.id = data.id;
    this.stars = data.stars;
    this.restaurant_id = data.restaurant_id;
    this.feedback = data.feedback;
    this.createdAt = data.createdAt;
    this.userId = data.userId;
    this.userName = data.userName;
    this.userProfilePhoto = data.userProfilePhoto;
  }

  static fromEntity(
    entity: Review & {
      user: { name: string; profilePhoto: string | null };
    },
  ): ReviewOutputDto {
    return new ReviewOutputDto({
      id: entity.id,
      stars: entity.stars.toString(),
      restaurant_id: entity.restaurant_id,
      feedback: entity.feedback,
      createdAt: entity.createdAt,
      userId: entity.user_id,
      userName: entity.user.name,
      userProfilePhoto: entity.user.profilePhoto,
    });
  }

  static fromEntities(
    entities: Array<
      Review & {
        user: { name: string; profilePhoto: string | null };
      }
    >,
  ): ReviewOutputDto[] {
    return entities.map(ReviewOutputDto.fromEntity);
  }
}
