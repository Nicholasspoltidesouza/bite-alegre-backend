import { PrismaClient, Publication } from '@prisma/client';

import { publicationRequestDto } from '../dtos/publication-dto.js';

const prisma = new PrismaClient();

export class PublicationRepository {
  static async create(
    data: Omit<publicationRequestDto, 'media'> & { url: string },
    user_id: string,
  ): Promise<Publication> {
    try {
      const { description, restaurant_id, url } = data;

      return prisma.publication.create({
        data: {
          description,
          restaurant_id,
          user_id,
          url,
        },
      });
    } catch (error) {
      console.error('Erro ao criar publicação:', error);
      throw new Error('Erro ao criar publicação');
    }
  }

  static async findByUser(userId: string) {
    return prisma.publication.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: {
          select: { name: true, profilePhoto: true },
        },
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
