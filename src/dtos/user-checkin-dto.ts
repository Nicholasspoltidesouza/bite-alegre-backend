import { Checkin } from '@prisma/client';

export class UserCheckinOutputDto {
  id: string;
  user_id: string;
  restaurant_id: string;
  time_at: Date;
  restaurantName: string;
  restaurantProfilePhoto?: string | null;

  constructor(data: UserCheckinOutputDto) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.restaurant_id = data.restaurant_id;
    this.time_at = data.time_at;
    this.restaurantName = data.restaurantName;
    this.restaurantProfilePhoto = data.restaurantProfilePhoto;
  }

  static fromEntity(
    entity: Checkin & {
      restaurant: { name: string; profilePhoto: string | null };
    },
  ): UserCheckinOutputDto {
    return new UserCheckinOutputDto({
      id: entity.id,
      user_id: entity.user_id,
      restaurant_id: entity.restaurant_id,
      time_at: entity.time_at,
      restaurantName: entity.restaurant.name,
      restaurantProfilePhoto: entity.restaurant.profilePhoto,
    });
  }

  static fromEntities(
    entities: Array<
      Checkin & { restaurant: { name: string; profilePhoto: string | null } }
    >,
  ): UserCheckinOutputDto[] {
    return entities.map(UserCheckinOutputDto.fromEntity);
  }
}
