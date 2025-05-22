import { PrismaClient, Restaurant } from '@prisma/client';

import {
  CreateRestaurantDto,
  RestaurantFilterDto,
} from '../dtos/restaurant-dto.js';
import { UserPreferenceDto } from '../dtos/user-preferences-dto.js';
import { calculateDistance } from '../utils/calculateDistance.js';

const prisma = new PrismaClient();

const PRICE_RANGE_TOLERANCE = 5;

export class RestaurantRepository {
  static async findByEmail(email: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { email },
    });
  }

  static async findTagsByIds(tagIds: string[]) {
    return prisma.tag.findMany({
      where: {
        id: { in: tagIds },
      },
    });
  }

  static async create(data: CreateRestaurantDto): Promise<Restaurant> {
    const {
      profilePhoto,
      bannerPhoto,
      name,
      description,
      address,
      email,
      password,
      averagePrice,
      phone,
      tagIds,
      latitude,
      longitude,
      cnpj,
    } = data;

    return prisma.restaurant.create({
      data: {
        profilePhoto,
        bannerPhoto,
        name,
        description,
        address,
        email,
        password,
        average_price: averagePrice ?? null,
        phone,
        cnpj,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        ...(tagIds && tagIds.length > 0
          ? {
              tags: {
                create: tagIds.map((tagId) => ({ tagId })),
              },
            }
          : {}),
      },
    });
  }

  static async findAll(): Promise<Restaurant[]> {
    return prisma.restaurant.findMany({
      include: {
        tags: true,
        review: true,
      },
    });
  }

  static async findOne(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        review: true,
        tags: true,
      },
    });
  }

  static async findByFilters(
    filters: RestaurantFilterDto,
    allowedRestaurantIds?: string[],
  ): Promise<Restaurant[]> {
    const where: any = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.price_range !== undefined) {
      where.average_price = {
        gte: filters.price_range - 5,
        lte: filters.price_range + 5,
      };
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        some: {
          tag: {
            id: { in: filters.tags },
          },
        },
      };
    }

    if (filters.open_now) {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.toTimeString().split(' ')[0];
      where.openingHours = {
        some: {
          day: currentDay,
          open: { lte: currentTime },
          close: { gte: currentTime },
        },
      };
    }

    if (allowedRestaurantIds && allowedRestaurantIds.length > 0) {
      where.id = { in: allowedRestaurantIds };
    }

    const allRestaurants = await prisma.restaurant.findMany({
      where,
      include: {
        tags: true,
        review: true,
      },
    });

    if (filters.geolocation && filters.proximity) {
      const [lat, lon] = filters.geolocation;
      return allRestaurants.filter((r) => {
        if (r.latitude == null || r.longitude == null) return false;
        const distance = calculateDistance(lat, lon, r.latitude, r.longitude);
        return distance <= filters.proximity!;
      });
    }

    return allRestaurants;
  }

  static async findByUserPreferences(userPreferences: UserPreferenceDto[]) {
    const tagIds = userPreferences.map((p) => p.tag_id);

    return prisma.restaurant.findMany({
      where: {
        tags: {
          some: {
            tag: {
              id: {
                in: tagIds,
              },
            },
          },
        },
      },
      include: { tags: true },
    });
  }

  static async findByTagsOrPriceRange(
    filters: Pick<RestaurantFilterDto, 'tags' | 'price_range'>,
  ): Promise<Restaurant[]> {
    const conditions: any[] = [];

    if (filters.price_range !== undefined) {
      conditions.push({
        average_price: {
          gte: filters.price_range - PRICE_RANGE_TOLERANCE,
          lte: filters.price_range + PRICE_RANGE_TOLERANCE,
        },
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagsAsStrings = filters.tags.map(String);

      conditions.push({
        tags: {
          some: {
            tag: {
              OR: [{ id: { in: tagsAsStrings } }],
            },
          },
        },
      });
    }

    const where = conditions.length > 0 ? { OR: conditions } : {};

    return prisma.restaurant.findMany({
      where,
      include: {
        tags: true,
        review: true,
      },
    });
  }
}
