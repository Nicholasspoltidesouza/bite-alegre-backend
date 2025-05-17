import { PrismaClient, Publication } from '@prisma/client';

import { publicationRequestDto } from '../dtos/publication-dto.js';

const prisma = new PrismaClient();

export class PublicationRepository {
  static async create(
    data: Omit<publicationRequestDto, 'media'> & { url: string },
    user_id: string,
  ): Promise<Publication> {
    const { description, restaurant_id, url } = data;

    return prisma.publication.create({
      data: {
        description,
        restaurant_id,
        user_id,
        url,
      },
    });
  }
}
