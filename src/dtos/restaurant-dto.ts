import { Prisma, Restaurant, Review, RestaurantDish } from '@prisma/client';

import { RestaurantDishesDto, RestaurantDishesOutputDto } from './dish-dto.js';
import { OpeningPeriodDto, OpeningPeriodsDto } from './opening-hour-dto.js';
import { ReviewOutputDto } from './review-dto.js';

export interface CreateRestaurantDto {
  profilePhoto?: string;
  bannerPhoto?: string;
  name: string;
  cnpj: string;
  description?: string;
  address: string;
  email: string;
  password: string;
  averagePrice?: Prisma.Decimal;
  phone: string;
  tagIds?: string[];
  latitude?: number;
  longitude?: number;
  openingPeriods?: OpeningPeriodsDto;
  menuItems?: RestaurantDishesDto;
}

export type UpdateOpeningPeriodsDto = {
  add?: OpeningPeriodsDto;
  update?: (OpeningPeriodDto & { periodId: string })[];
  delete?: string[];
};

export type UpdateRestaurantDto = {
  restaurantId: string;
  name?: string;
  description?: string;
  address?: string;
  email?: string;
  averagePrice?: Prisma.Decimal;
  phone?: string;
  profilePhoto?: string;
  tags?: string[];
  openingPeriods?: UpdateOpeningPeriodsDto;
};

export interface RestaurantFilterDto {
  name?: string;
  geolocation?: [number, number];
  address?: string;
  proximity?: number;
  price_range?: number;
  tags?: string[];
  open_now?: boolean;
}

export class RestaurantOutputDto {
  id: string;
  profilePhoto?: string | null;
  bannerPhoto?: string | null;
  name: string;
  description?: string | null;
  address: string;
  averagePrice?: string | null;
  phone: string;
  latitude?: number | null;
  longitude?: number | null;
  averageScore?: number | null;
  reviews?: ReviewOutputDto[];
  menuItems?: RestaurantDishesOutputDto[];

  constructor(
    data: Omit<RestaurantOutputDto, 'reviews'> & {
      reviews?: ReviewOutputDto[];
    },
  ) {
    this.id = data.id;
    this.profilePhoto = data.profilePhoto ?? null;
    this.bannerPhoto = data.bannerPhoto ?? null;
    this.name = data.name;
    this.description = data.description ?? null;
    this.address = data.address;
    this.averagePrice = data.averagePrice ?? null;
    this.averageScore = data.averageScore ?? null;
    this.phone = data.phone;
    this.latitude = data.latitude ?? null;
    this.longitude = data.longitude ?? null;
    this.reviews = data.reviews ?? [];
    this.menuItems = data.menuItems ?? [];
  }

  static fromEntity(
    entity: Restaurant & {
      review?: Review[];
      restaurantDishes?: RestaurantDish[];
    },
  ): RestaurantOutputDto {
    const averageScore = entity.review?.length
      ? Number(
          (
            entity.review.reduce((sum, r) => sum + r.stars.toNumber(), 0) /
            entity.review.length
          ).toFixed(1),
        )
      : null;

    return new RestaurantOutputDto({
      id: entity.id,
      profilePhoto: entity.profilePhoto,
      bannerPhoto: entity.bannerPhoto,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      averagePrice: entity.average_price?.toString() ?? null,
      averageScore,
      phone: entity.phone,
      latitude: entity.latitude ?? null,
      longitude: entity.longitude ?? null,
      reviews: entity.review ? ReviewOutputDto.fromEntities(entity.review) : [],
      menuItems: entity.restaurantDishes
        ? RestaurantDishesOutputDto.fromEntities(entity.restaurantDishes)
        : [],
    });
  }

  static fromEntities(entities: Restaurant[]): RestaurantOutputDto[] {
    return entities.map(RestaurantOutputDto.fromEntity);
  }
}
export class RestaurantFeedOutputDto {
  id: string;
  profilePhoto?: string | null;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  averageScore?: number | null;
  reviews?: ReviewOutputDto[];

  constructor(
    data: Omit<RestaurantFeedOutputDto, 'reviews'> & {
      reviews?: ReviewOutputDto[];
    },
  ) {
    this.id = data.id;
    this.profilePhoto = data.profilePhoto ?? null;
    this.name = data.name;
    this.averageScore = data.averageScore ?? null;
    this.latitude = data.latitude ?? null;
    this.longitude = data.longitude ?? null;
  }

  static fromEntity(
    entity: Restaurant & { review?: Review[] },
  ): RestaurantFeedOutputDto {
    const averageScore = entity.review?.length
      ? Number(
          (
            entity.review.reduce((sum, r) => sum + r.stars.toNumber(), 0) /
            entity.review.length
          ).toFixed(1),
        )
      : null;

    return new RestaurantFeedOutputDto({
      id: entity.id,
      profilePhoto: entity.profilePhoto,
      name: entity.name,
      averageScore,
      latitude: entity.latitude ?? null,
      longitude: entity.longitude ?? null,
    });
  }

  static fromEntities(entities: Restaurant[]): RestaurantFeedOutputDto[] {
    return entities.map(RestaurantFeedOutputDto.fromEntity);
  }
}
