import { PrismaClient, Restaurant } from '@prisma/client';

import {
  CreateRestaurantDto,
  RestaurantFilterDto,
} from '../dtos/restaurant-dto.js';
import { UserPreferenceDto } from '../dtos/user-preferences-dto.js';
import { calculateDistance } from '../utils/calculateDistance.js';

const prisma = new PrismaClient();

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
        lte: filters.price_range,
      };
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        some: {
          name: { in: filters.tags },
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
    return prisma.restaurant.findMany({
      where: {
        tags: {
          some: { tagId: { in: [...userPreferences.map((p) => p.tag_id)] } },
        },
      },
      include: {
        tags: true,
        review: true,
      },
    });
  }
}
