import { Gender, Checkin, Review, User } from '@prisma/client';

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

  constructor(data: UserSearchOutputDto) {
    this.id = data.id;
    this.profilePhoto = data.profilePhoto ?? null;
    this.name = data.name;
    this.nickname = data.nickname;
  }

  static fromEntity(entity: User): UserSearchOutputDto {
    return new UserSearchOutputDto({
      id: entity.id,
      profilePhoto: entity.profilePhoto,
      name: entity.name,
      nickname: entity.nickname,
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
  checkinsWithoutReview!: UserCheckinOutputDto[];

  constructor(data: {
    id: string;
    profilePhoto?: string | null;
    name: string;
    nickname: string;
    reviews: UserReviewOutputDto[];
    checkinsWithoutReview: UserCheckinOutputDto[];
  }) {
    this.id = data.id;
    this.profilePhoto = data.profilePhoto ?? null;
    this.name = data.name;
    this.nickname = data.nickname;
    this.reviews = data.reviews;
    this.checkinsWithoutReview = data.checkinsWithoutReview;
  }

  static fromEntity(
    user: User,
    reviews: Array<
      Review & { restaurant: { name: string; profilePhoto: string | null } }
    >,
    checkins: Array<
      Checkin & { restaurant: { name: string; profilePhoto: string | null } }
    >,
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

    return new UserOutputDto({
      id: user.id,
      profilePhoto: user.profilePhoto,
      name: user.name,
      nickname: user.nickname,
      reviews: reviewsDto,
      checkinsWithoutReview: checkinsDto,
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
    }>,
  ): UserOutputDto[] {
    return data.map(({ user, reviews, checkins }) =>
      UserOutputDto.fromEntity(user, reviews, checkins),
    );
  }
}
