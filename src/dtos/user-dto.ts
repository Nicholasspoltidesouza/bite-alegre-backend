import { Gender, Checkin, Review, User } from '@prisma/client';

import { RestaurantOutputDto } from './restaurant-dto.js';
import { UserCheckinOutputDto } from './user-checkin-dto.js';
import { UserReviewOutputDto } from './user-review-dto.js';

export interface CreateUserDto {
  profilePhoto?: string;
  name: string;
  nickname: string;
  email: string;
  password: string;
  phone?: string;
  influencer?: boolean;
  gender: Gender;
  birthDate: Date;
  createdAt?: Date;
  tagIds: string[];
}

export class UserSearchOutputDto {
  id: string;
  profilePhoto?: string | null;
  name: string;
  nickname: string;
  influencer?: boolean | null;

  constructor(data: UserSearchOutputDto) {
    this.id = data.id;
    this.profilePhoto = data.profilePhoto ?? null;
    this.name = data.name;
    this.nickname = data.nickname;
    this.influencer = data.influencer ?? false;
  }

  static fromEntity(entity: User): UserSearchOutputDto {
    return new UserSearchOutputDto({
      id: entity.id,
      profilePhoto: entity.profilePhoto,
      name: entity.name,
      nickname: entity.nickname,
      influencer: entity.influencer ?? false,
    });
  }

  static fromEntities(entities: User[]): UserSearchOutputDto[] {
    return entities.map(UserSearchOutputDto.fromEntity);
  }
}

export interface SavedRestaurantDto {
  restaurantId: string;
  profilePhoto: string | null;
  averageScore: number | null;
}

export class UserOutputDto {
  id!: string;
  profilePhoto?: string | null;
  name!: string;
  nickname!: string;
  reviews!: UserReviewOutputDto[];
  influencer?: boolean | null;
  checkinsWithoutReview!: UserCheckinOutputDto[];
  savedRestaurants!: SavedRestaurantDto[];

  constructor(data: {
    id: string;
    profilePhoto?: string | null;
    name: string;
    nickname: string;
    influencer?: boolean | null;
    reviews: UserReviewOutputDto[];
    checkinsWithoutReview: UserCheckinOutputDto[];
    savedRestaurants: SavedRestaurantDto[];
  }) {
    this.id = data.id;
    this.profilePhoto = data.profilePhoto ?? null;
    this.name = data.name;
    this.nickname = data.nickname;
    this.influencer = data.influencer ?? false;
    this.reviews = data.reviews;
    this.checkinsWithoutReview = data.checkinsWithoutReview;
    this.savedRestaurants = data.savedRestaurants;
  }

  static fromEntity(
    user: User,
    reviews: Array<
      Review & { restaurant: { name: string; profilePhoto: string | null } }
    >,
    checkins: Array<
      Checkin & { restaurant: { name: string; profilePhoto: string | null } }
    >,
    savedRestaurantsInput: Array<RestaurantOutputDto>,
  ): UserOutputDto {
    const reviewsDto = UserReviewOutputDto.fromEntities(reviews);

    const reviewedRestIds = new Set(reviews.map((r) => r.restaurant_id));
    const withoutReview = checkins.filter(
      (c) => !reviewedRestIds.has(c.restaurant_id),
    );

    const map = new Map<
      string,
      Checkin & { restaurant: { name: string; profilePhoto: string | null } }
    >();
    withoutReview.forEach((c) =>
      map.set(c.restaurant_id, map.get(c.restaurant_id) ?? c),
    );
    const uniqueCheckins = Array.from(map.values());

    const checkinsDto = uniqueCheckins.map(UserCheckinOutputDto.fromEntity);

    const savedRestaurantsDto: SavedRestaurantDto[] = savedRestaurantsInput.map(
      (restaurantDto) => {
        return {
          restaurantId: restaurantDto.id,
          profilePhoto: restaurantDto.profilePhoto ?? null,
          averageScore: restaurantDto.averageScore ?? null,
        };
      },
    );

    return new UserOutputDto({
      id: user.id,
      profilePhoto: user.profilePhoto,
      name: user.name,
      nickname: user.nickname,
      influencer: user.influencer,
      reviews: reviewsDto,
      checkinsWithoutReview: checkinsDto,
      savedRestaurants: savedRestaurantsDto,
    });
  }

  static fromEntities(
    data: Array<{
      user: User;
      reviews: Array<
        Review & { restaurant: { name: string; profilePhoto: string | null } }
      >;
      checkins: Array<
        Checkin & { restaurant: { name: string; profilePhoto: string | null } }
      >;
      savedRestaurants: Array<RestaurantOutputDto>;
    }>,
  ): UserOutputDto[] {
    return data.map(({ user, reviews, checkins, savedRestaurants }) =>
      UserOutputDto.fromEntity(user, reviews, checkins, savedRestaurants),
    );
  }
}
