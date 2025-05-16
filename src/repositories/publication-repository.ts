import { PrismaClient, Publication } from '@prisma/client';

import { publicationRequestDto } from '../dtos/publication-dto.js';

export class PublicationRepository {
  static async create(data: publicationRequestDto): Promise<Publication> {
    const { media, description, restaurant_id, user_id } = data;

    return PrismaClient.checkin.create({
      data: {
        media,
        description,
        restaurant_id,
        user_id,
      },
    });
  }
}
