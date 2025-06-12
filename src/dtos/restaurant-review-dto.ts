import { Review } from '@prisma/client';

export class RestaurantReviewOutputDto {
  id: string;
  stars: string;
  feedback?: string | null;
  createdAt: Date;

  userId: string;
  userName: string;
  userProfilePhoto?: string | null;

  constructor(data: {
    id: string;
    stars: string;
    feedback?: string | null;
    createdAt: Date;
    userId: string;
    userName: string;
    userProfilePhoto?: string | null;
  }) {
    this.id = data.id;
    this.stars = data.stars;
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
  ): RestaurantReviewOutputDto {
    return new RestaurantReviewOutputDto({
      id: entity.id,
      stars: entity.stars.toString(),
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
  ): RestaurantReviewOutputDto[] {
    return entities.map(RestaurantReviewOutputDto.fromEntity);
  }
}
