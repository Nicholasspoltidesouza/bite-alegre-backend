import {
  CreateRestaurantDto,
  RestaurantFilterDto,
  RestaurantOutputDto,
} from '../dtos/restaurant-dto.js';
import { UserPreferenceDto } from '../dtos/user-preferences-dto.js';
import { RestaurantRepository } from '../repositories/restaurant-repository.js';
import { calculateDistance } from '../utils/calculateDistance.js';
import { hashPassword } from '../utils/crypto.js';
import { geocodeAddress } from '../utils/geocoding.js';

import { OpeningHourService } from './opening-hour-service.js';
import { UserPreferencesService } from './user-preferences-service.js';

export class RestaurantService {
  static async createRestaurant(input: CreateRestaurantDto) {
    const { name, cnpj, address, email, password, tagIds, openingPeriods } =
      input;

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
    if (openingPeriods && openingPeriods.length) {
      await OpeningHourService.addPeriods(restaurantEntity.id, openingPeriods);
    }

    return RestaurantOutputDto.fromEntity(restaurantEntity);
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
      throw new Error('Restaurants not found.');
    }

    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const randomRestaurant = restaurants[randomIndex];

    return RestaurantOutputDto.fromEntity(randomRestaurant);
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

  static async getRestaurants(filters: RestaurantFilterDto) {
    const restaurants = await RestaurantRepository.findByFilters(filters);
    return RestaurantOutputDto.fromEntities(restaurants);
  }

  static async getRestaurantById(id: string) {
    const restaurant = await RestaurantRepository.findOne(id);
    if (!restaurant) {
      throw new Error('Restaurant not found.');
    }
    return RestaurantOutputDto.fromEntity(restaurant);
  }

  static async findByUserPreferences(userPreferences: UserPreferenceDto[]) {
    return RestaurantRepository.findByUserPreferences(userPreferences);
  }
}
