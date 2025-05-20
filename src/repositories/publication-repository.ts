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
  static async findOne(id: string): Promise<
    | (Publication & {
        user: { nickname: string };
        restaurant: {
          name: string;
          tags: { tag: { id: string; name: string; type: string } }[];
        };
      })
    | null
  > {
    return prisma.publication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
        restaurant: {
          select: {
            name: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });
  }
}
