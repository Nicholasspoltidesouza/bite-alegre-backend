import { Review } from '@prisma/client';

export class UserReviewOutputDto {
  id: string;
  stars: string;
  feedback?: string | null;

  restaurantId: string;
  restaurantName: string;
  restaurantProfilePhoto?: string | null;

  constructor(data: {
    id: string;
    stars: string;
    feedback?: string | null;
    restaurantId: string;
    restaurantName: string;
    restaurantProfilePhoto?: string | null;
  }) {
    this.id = data.id;
    this.stars = data.stars;
    this.feedback = data.feedback;
    this.restaurantId = data.restaurantId;
    this.restaurantName = data.restaurantName;
    this.restaurantProfilePhoto = data.restaurantProfilePhoto;
  }

  static fromEntity(
    entity: Review & {
      restaurant: { name: string; profilePhoto: string | null };
    },
  ): UserReviewOutputDto {
    return new UserReviewOutputDto({
      id: entity.id,
      stars: entity.stars.toString(),
      feedback: entity.feedback,
      restaurantId: entity.restaurant_id,
      restaurantName: entity.restaurant.name,
      restaurantProfilePhoto: entity.restaurant.profilePhoto,
    });
  }

  static fromEntities(
    entities: Array<
      Review & { restaurant: { name: string; profilePhoto: string | null } }
    >,
  ): UserReviewOutputDto[] {
    return entities.map(UserReviewOutputDto.fromEntity);
  }
}
