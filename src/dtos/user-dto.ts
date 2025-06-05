import { Gender, Checkin, Review, User } from '@prisma/client';

import { SavedRestaurantOutputDto } from './favorite-dto.js';
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
export interface UpdateUserDto {
  profilePhoto?: string;
  name: string;
  nickname: string;
  email: string;
  password?: string;
  phone?: string;
  birthDate: Date;
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

export class UserOutputDto {
  id!: string;
  profilePhoto?: string | null;
  name!: string;
  nickname!: string;
  reviews!: UserReviewOutputDto[];
  influencer?: boolean | null;
  checkinsWithoutReview!: UserCheckinOutputDto[];
  savedRestaurants: SavedRestaurantOutputDto[];

  constructor(data: {
    id: string;
    profilePhoto?: string | null;
    name: string;
    nickname: string;
    influencer?: boolean | null;
    reviews: UserReviewOutputDto[];
    checkinsWithoutReview: UserCheckinOutputDto[];
    savedRestaurants: SavedRestaurantOutputDto[];
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
    favorites: Array<{
      restaurant: { id: string; profilePhoto: string | null; review: Review[] };
    }>,
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

    const savedRestaurantsDto = favorites.map((fav) => {
      const averageScore = fav.restaurant.review.length
        ? Number(
            (
              fav.restaurant.review.reduce(
                (sum, r) => sum + r.stars.toNumber(),
                0,
              ) / fav.restaurant.review.length
            ).toFixed(1),
          )
        : null;
      return new SavedRestaurantOutputDto({
        restaurantId: fav.restaurant.id,
        profilePhoto: fav.restaurant.profilePhoto,
        averageScore,
      });
    });

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
      favorites: Array<{
        restaurant: {
          id: string;
          profilePhoto: string | null;
          review: Review[];
        };
      }>;
    }>,
  ): UserOutputDto[] {
    return data.map(({ user, reviews, checkins, favorites }) =>
      UserOutputDto.fromEntity(user, reviews, checkins, favorites),
    );
  }
}
