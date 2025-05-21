import { Publication } from '@prisma/client';
import type { Express } from 'express';

export interface publicationRequestDto {
  media: Express.Multer.File;
  description: string;
  restaurant_id: string;
}

export class publicationResponseDto {
  user_id: string;

  constructor(data: publicationResponseDto) {
    this.user_id = data.user_id;
  }
  static fromEntity(entity: Publication): publicationResponseDto {
    return new publicationResponseDto({
      user_id: entity.user_id,
    });
  }
  static fromEntities(entities: Publication[]): publicationResponseDto[] {
    return entities.map(publicationResponseDto.fromEntity);
  }
}

export class PublicationListItemDto {
  url: string;
  description: string;
  restaurantName: string;
  restaurantPhoto: string | null;

  constructor(data: {
    url: string;
    description: string;
    restaurantName: string;
    restaurantPhoto: string | null;
  }) {
    this.url = data.url;
    this.description = data.description;
    this.restaurantName = data.restaurantName;
    this.restaurantPhoto = data.restaurantPhoto;
  }

  static fromEntity(
    entity: Publication & {
      restaurant: { name: string; profilePhoto: string | null };
    },
  ): PublicationListItemDto {
    return new PublicationListItemDto({
      url: entity.url,
      description: entity.description,
      restaurantName: entity.restaurant.name,
      restaurantPhoto: entity.restaurant.profilePhoto,
    });
  }

  static fromEntities(
    entities: Array<
      Publication & {
        restaurant: { name: string; profilePhoto: string | null };
      }
    >,
  ): PublicationListItemDto[] {
    return entities.map(PublicationListItemDto.fromEntity);
  }
}
