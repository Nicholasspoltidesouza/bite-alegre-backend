import { RestaurantFilterDto } from '../dtos/restaurant-dto.js';

import { RestaurantService } from './restaurant-service.js';
import { UserPreferencesService } from './user-preferences-service.js';

export class FeedService {
  static async restaurantsOnFeed(
    id: string,
    latitude?: number,
    longitude?: number,
    proximity?: number,
  ) {
    const userPreferences = await UserPreferencesService.findByUserId(id);

    if (!userPreferences) {
      throw new Error(
        "Unable to find restaurants related to this users' preferences.",
      );
    }

    const restaurantsByUserPreference =
      await RestaurantService.findByUserPreferences(userPreferences);

    const preferenceMap = new Map<string, number>();
    userPreferences.forEach((pref) => {
      preferenceMap.set(pref.tag_id, pref.weight);
    });

    const scoredRestaurants = restaurantsByUserPreference
      .map((restaurant) => {
        let score = 0;

        restaurant.tags.forEach((tag) => {
          const weight = preferenceMap.get(tag.tagId);
          if (weight) {
            score += weight;
          }
        });

        return { ...restaurant, preferenceScore: score };
      })
      .filter((r) => r.preferenceScore > 0)
      .sort((a, b) => b.preferenceScore - a.preferenceScore);

    if (latitude && longitude) {
      const proximityFilters: RestaurantFilterDto = {
        proximity: proximity ?? 30,
        geolocation: [latitude, longitude],
      };
      const restaurantsNearMe =
        await RestaurantService.filterRestaurantListByProximity(
          scoredRestaurants,
          proximityFilters,
        );

      if (!restaurantsNearMe) {
        throw new Error(
          'Unable to find restaurants by user preferences and near this geolocation.',
        );
      }
      return restaurantsNearMe;
    }

    return scoredRestaurants;
  }
}
