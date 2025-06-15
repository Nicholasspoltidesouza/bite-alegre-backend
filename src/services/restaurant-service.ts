import {
  CreateRestaurantDto,
  RestaurantFilterDto,
  RestaurantOutputDto,
  UpdateRestaurantDto,
} from '../dtos/restaurant-dto.js';
import { UserPreferenceDto } from '../dtos/user-preferences-dto.js';
import { RestaurantRepository } from '../repositories/restaurant-repository.js';
import { calculateDistance } from '../utils/calculateDistance.js';
import { hashPassword } from '../utils/crypto.js';
import { geocodeAddress } from '../utils/geocoding.js';

import { DishService } from './dish-service.js';
import { FavoriteService } from './favorite-service.js';
import { OpeningHourService } from './opening-hour-service.js';
import { UserPreferencesService } from './user-preferences-service.js';

export class RestaurantService {
  static async createRestaurant(input: CreateRestaurantDto) {
    const {
      name,
      cnpj,
      address,
      email,
      password,
      tagIds,
      openingPeriods,
      menuItems,
    } = input;

    if (!name || !cnpj || !address || !email || !password) {
      throw new Error('Required fields: name, cnpj, address, email, password.');
    }

    const existing = await RestaurantRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email is already in use by another restaurant.');
    }

    if (tagIds && tagIds.length > 0) {
      const foundTags = await RestaurantRepository.findTagsByIds(tagIds);
      if (foundTags.length !== tagIds.length) {
        throw new Error('One or more provided tags were not found.');
      }
    }

    const { lat, lng } = await geocodeAddress(address);

    const hashedPassword = await hashPassword(password);

    const restaurantEntity = await RestaurantRepository.create({
      ...input,
      password: hashedPassword,
      latitude: lat,
      longitude: lng,
    });

    if (menuItems && menuItems.length) {
      await DishService.addDishes(restaurantEntity.id, menuItems);
    }

    if (openingPeriods && openingPeriods.length) {
      await OpeningHourService.addPeriods(restaurantEntity.id, openingPeriods);
    }

    return RestaurantOutputDto.fromEntity(restaurantEntity);
  }

  static async updateRestaurant({
    restaurantId,
    name,
    description,
    address,
    email,
    averagePrice,
    phone,
    profilePhoto,
    tags,
    openingPeriods,
    menuItems,
    menuMedias,
  }: UpdateRestaurantDto): Promise<RestaurantOutputDto | null> {
    const restaurant = await RestaurantRepository.findOne(restaurantId);
    if (!restaurant) return null;

    const updateData: Partial<CreateRestaurantDto> = {
      name,
      description,
      address,
      email,
      averagePrice,
      phone,
      profilePhoto,
    };

    if (address && address !== restaurant.address) {
      const { lat, lng } = await geocodeAddress(address);
      updateData.latitude = lat;
      updateData.longitude = lng;
    }

    if (tags) {
      await RestaurantRepository.updateTags(restaurantId, tags);
    }

    if (openingPeriods) {
      const { add, update, delete: toDelete } = openingPeriods;

      if (toDelete?.length) {
        for (const periodId of toDelete) {
          await OpeningHourService.deletePeriod(restaurantId, periodId);
        }
      }

      if (update?.length) {
        for (const item of update) {
          const { periodId, ...rest } = item;
          await OpeningHourService.updatePeriod(restaurantId, periodId, rest);
        }
      }

      if (add?.length) {
        await OpeningHourService.addPeriods(restaurantId, add);
      }
    }

    if (menuItems) {
      await DishService.syncDishes(restaurantId, menuItems, menuMedias ?? []);
    }

    const updatedRestaurant = await RestaurantRepository.update(
      restaurantId,
      updateData,
    );

    return RestaurantOutputDto.fromEntity(updatedRestaurant);
  }

  static async getRandomRestaurant(
    userId: string,
    filters: RestaurantFilterDto,
  ) {
    let restaurants;

    const hasFilters = filters.tags || filters.price_range;

    if (hasFilters) {
      restaurants = await RestaurantRepository.findByTagsOrPriceRange(filters);
    }

    if (!restaurants || restaurants.length === 0) {
      const userPreferences = await UserPreferencesService.findByUserId(userId);
      restaurants =
        await RestaurantRepository.findByUserPreferences(userPreferences);
    }

    if (!restaurants || restaurants.length === 0) {
      throw new Error(
        'No restaurants found matching the given filters or user preferences.',
      );
    }

    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const randomRestaurant = restaurants[randomIndex];

    const favoriteIds = await FavoriteService.getUserFavoriteIds(userId);
    const isFavorite = favoriteIds.includes(randomRestaurant.id);

    return RestaurantOutputDto.fromEntity(randomRestaurant, isFavorite);
  }

  static async filterRestaurantListByProximity(
    restaurants: any[],
    filters: RestaurantFilterDto,
  ) {
    if (filters.geolocation && filters.proximity) {
      const [lat, lon] = filters.geolocation;
      return restaurants.filter((r) => {
        if (r.latitude == null || r.longitude == null) return false;
        const distance = calculateDistance(lat, lon, r.latitude, r.longitude);
        return distance <= filters.proximity!;
      });
    }

    return [];
  }

  static async getRestaurants(filters: RestaurantFilterDto, userId?: string) {
    const restaurants = await RestaurantRepository.findByFilters(filters);

    let favoriteRestaurantIds: string[] | undefined;
    if (userId) {
      favoriteRestaurantIds = await FavoriteService.getUserFavoriteIds(userId);
    }

    return RestaurantOutputDto.fromEntities(restaurants, favoriteRestaurantIds);
  }

  static async getRestaurantById(id: string, userId?: string) {
    const restaurant = await RestaurantRepository.findOne(id);
    if (!restaurant) {
      throw new Error('Restaurant not found.');
    }

    let isFavorite: boolean | undefined;
    if (userId) {
      const favoriteIds = await FavoriteService.getUserFavoriteIds(userId);
      isFavorite = favoriteIds.includes(id);
    }

    return RestaurantOutputDto.fromEntity(restaurant, isFavorite);
  }

  static async findByUserPreferences(userPreferences: UserPreferenceDto[]) {
    return RestaurantRepository.findByUserPreferences(userPreferences);
  }

  static async deleteDish(restaurantId: string, itemId: string) {
    const restaurant = await RestaurantRepository.findOne(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found.');
    }

    const dish = await RestaurantRepository.findDishById(itemId);
    if (!dish) {
      throw new Error('Menu item not found.');
    }
    if (dish.restaurant_id !== restaurantId) {
      throw new Error('Menu item does not belong to this restaurant.');
    }

    await RestaurantRepository.deleteDish(dish);
  }
}
