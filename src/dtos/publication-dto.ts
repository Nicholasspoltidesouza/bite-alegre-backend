import { Publication } from '@prisma/client';
import type { Express } from 'express-serve-static-core';

export interface publicationRequestDto {
  media: Express.Multer.File;
  description: string;
  restaurant_id: string;
}

export class publicationResponseDto {
  id: string;
  user_id: string;
  description: string;
  restaurant_id: string;
  url: string;

  constructor(data: publicationResponseDto) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.description = data.description;
    this.restaurant_id = data.restaurant_id;
    this.url = data.url;
  }
  static fromEntity(entity: Publication): publicationResponseDto {
    return new publicationResponseDto({
      id: entity.id,
      user_id: entity.user_id,
      description: entity.description,
      restaurant_id: entity.restaurant_id,
      url: entity.url,
    });
  }
  static fromEntities(entities: Publication[]): publicationResponseDto[] {
    return entities.map(publicationResponseDto.fromEntity);
  }
}

export class PublicationListItemDto {
  id: string;
  url: string;
  description: string;
  restaurantName: string;
  restaurantPhoto: string | null;

  constructor(data: {
    id: string;
    url: string;
    description: string;
    restaurantName: string;
    restaurantPhoto: string | null;
  }) {
    this.id = data.id;
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
      id: entity.id,
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

export class PublicationOutputDto {
  user_id: string;
  user_nickname: string;
  url: string;
  description: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_tags: { id: string; name: string; type: string }[];

  constructor(data: PublicationOutputDto) {
    this.user_id = data.user_id;
    this.user_nickname = data.user_nickname;
    this.url = data.url;
    this.description = data.description;
    this.restaurant_id = data.restaurant_id;
    this.restaurant_name = data.restaurant_name;
    this.restaurant_tags = data.restaurant_tags;
  }

  static fromEntity(
    entity: Publication & {
      user: { nickname: string };
      restaurant: {
        name: string;
        tags: { tag: { id: string; name: string; type: string } }[];
      };
    },
  ): PublicationOutputDto {
    return new PublicationOutputDto({
      user_id: entity.user_id,
      user_nickname: entity.user.nickname,
      url: entity.url,
      description: entity.description,
      restaurant_id: entity.restaurant_id,
      restaurant_name: entity.restaurant.name,
      restaurant_tags: entity.restaurant.tags.map((t) => t.tag),
    });
  }

  static fromEntities(
    entities: (Publication & {
      user: { nickname: string };
      restaurant: {
        name: string;
        tags: { tag: { id: string; name: string; type: string } }[];
      };
    })[],
  ): PublicationOutputDto[] {
    return entities.map(PublicationOutputDto.fromEntity);
  }
}
