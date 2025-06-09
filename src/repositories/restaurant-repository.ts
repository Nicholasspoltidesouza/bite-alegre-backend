import { PrismaClient, Restaurant, RestaurantDish } from '@prisma/client';

import {
  CreateRestaurantDto,
  RestaurantFilterDto,
} from '../dtos/restaurant-dto.js';
import { UserPreferenceDto } from '../dtos/user-preferences-dto.js';
import { calculateDistance } from '../utils/calculateDistance.js';
import { geocodeAddress } from '../utils/geocoding.js';

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
        restaurantDishes: true,
      },
    });
  }

  static async findOne(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        review: true,
        tags: true,
        openingHours: true,
        publications: true,
        restaurantDishes: true,
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

      const weekdayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const currentWeekday = weekdayMap[now.getDay()];

      where.openingHours = {
        some: {
          weekday: currentWeekday,
          opensAt: { lte: now },
          closesAt: { gte: now },
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

    if (filters.address) {
      try {
        const { lat, lng } = await geocodeAddress(filters.address);
        filters.geolocation = [lat, lng];
      } catch (error) {
        console.error('Error during geocoding:', error);
        filters.geolocation = undefined;
      }
    }

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

  static async update(
    restaurantId: string,
    data: Partial<CreateRestaurantDto>,
  ): Promise<Restaurant> {
    return prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        email: data.email,
        average_price: data.averagePrice ?? undefined,
        phone: data.phone,
        profilePhoto: data.profilePhoto,
        latitude: data.latitude ?? undefined,
        longitude: data.longitude ?? undefined,
      },
      include: {
        tags: true,
        review: true,
        openingHours: true,
      },
    });
  }

  static async updateTags(
    restaurantId: string,
    tagIds: string[],
  ): Promise<void> {
    await prisma.restaurantTag.deleteMany({
      where: {
        restaurantId,
      },
    });

    await prisma.restaurantTag.createMany({
      data: tagIds.map((tagId) => ({
        restaurantId,
        tagId,
      })),
      skipDuplicates: true,
    });
  }

  static async deleteDishesFromRestaurant(restaurantId: string): Promise<void> {
    await prisma.restaurantDish.deleteMany({
      where: {
        restaurant_id: restaurantId,
      },
    });
  }

  static async createDish(data: {
    restaurant_id: string;
    name: string;
    dish_price: number;
    dish_photo: string;
    main_dish: boolean;
    description: string;
  }): Promise<void> {
    await prisma.restaurantDish.create({
      data,
    });
  }

  static async deleteDish(dish: RestaurantDish): Promise<void> {
    await prisma.restaurantDish.delete({
      where: {
        id: dish.id,
      },
    });
  }

  static async findDishById(dishId: string) {
    return prisma.restaurantDish.findUnique({
      where: {
        id: dishId,
      },
    });
  }
}
