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

  static async findByUser(restaurant_ids: string[], userId: string) {
    return prisma.publication.findMany({
      where: {
        restaurant_id: { in: restaurant_ids },
        user_id: userId,
      },
      include: {
        restaurant: {
          select: {
            name: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findByRestaurants(restaurant_ids: string[]) {
    return prisma.publication.findMany({
      where: {
        restaurant_id: { in: restaurant_ids },
      },
      include: {
        restaurant: {
          select: {
            name: true,
            profilePhoto: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findRestaurants(userId: string): Promise<string[]> {
    const publications = await prisma.publication.findMany({
      where: { user_id: userId },
      select: { restaurant_id: true },
    });
    const restaurantIds = Array.from(
      new Set(publications.map((p) => p.restaurant_id)),
    );
    return restaurantIds;
  }

  static async findOne(id: string): Promise<
    | (Publication & {
        user: { nickname: string };
        restaurant: {
          profilePhoto: string | null;
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
            profilePhoto: true,
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
