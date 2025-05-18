import { Publication } from '@prisma/client';
import type Express from 'express';

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
