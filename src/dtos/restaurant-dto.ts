import { Prisma, Restaurant, Review } from '@prisma/client';

import { OpeningPeriodsDto } from './opening-hour-dto.js';
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
}

export interface RestaurantFilterDto {
  name?: string;
  geolocation?: [number, number];
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
  cnpj: string;
  description?: string | null;
  address: string;
  averagePrice?: string | null;
  phone: string;
  latitude?: number | null;
  longitude?: number | null;
  averageScore?: number | null;
  reviews?: ReviewOutputDto[];

  constructor(
    data: Omit<RestaurantOutputDto, 'reviews'> & {
      reviews?: ReviewOutputDto[];
    },
  ) {
    this.id = data.id;
    this.profilePhoto = data.profilePhoto ?? null;
    this.bannerPhoto = data.bannerPhoto ?? null;
    this.name = data.name;
    this.cnpj = data.cnpj;
    this.description = data.description ?? null;
    this.address = data.address;
    this.averagePrice = data.averagePrice ?? null;
    this.averageScore = data.averageScore ?? null;
    this.phone = data.phone;
    this.latitude = data.latitude ?? null;
    this.longitude = data.longitude ?? null;
    this.reviews = data.reviews ?? [];
  }

  static fromEntity(
    entity: Restaurant & { review?: Review[] },
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
      cnpj: entity.cnpj,
      description: entity.description,
      address: entity.address,
      averagePrice: entity.average_price?.toString() ?? null,
      averageScore,
      phone: entity.phone,
      latitude: entity.latitude ?? null,
      longitude: entity.longitude ?? null,
      reviews: entity.review ? ReviewOutputDto.fromEntities(entity.review) : [],
    });
  }

  static fromEntities(entities: Restaurant[]): RestaurantOutputDto[] {
    return entities.map(RestaurantOutputDto.fromEntity);
  }
}
