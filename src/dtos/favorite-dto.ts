import { Favorite } from '@prisma/client';

export interface CreateFavoriteDto {
  user_id: string;
  restaurant_id: string;
  time_at?: Date;
}

export class FavoriteOutputDto {
  id: string;
  user_id: string;
  restaurant_id: string;
  time_at: Date;

  constructor(data: FavoriteOutputDto) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.restaurant_id = data.restaurant_id;
    this.time_at = data.time_at;
  }

  static fromEntity(entity: Favorite): FavoriteOutputDto {
    return new FavoriteOutputDto({
      id: entity.id,
      user_id: entity.user_id,
      restaurant_id: entity.restaurant_id,
      time_at: entity.time_at,
    });
  }

  static fromEntities(entities: Favorite[]): FavoriteOutputDto[] {
    return entities.map(FavoriteOutputDto.fromEntity);
  }
}

export class SavedRestaurantOutputDto {
  restaurantId: string;
  profilePhoto?: string | null;
  averageScore?: number | null;

  constructor(data: {
    restaurantId: string;
    profilePhoto?: string | null;
    averageScore?: number | null;
  }) {
    this.restaurantId = data.restaurantId;
    this.profilePhoto = data.profilePhoto ?? null;
    this.averageScore = data.averageScore ?? null;
  }
}
