import { RestaurantTag } from '../dtos/tags.dto.js';
import { RestaurantTagRepository } from '../repositories/restaurant-tag.repository.js';
import { TagRepository } from '../repositories/tag-repository.js';

import { RestaurantService } from './restaurant-service.js';

export class RestaurantTagService {
  static async createRestaurantTagsFromList(
    listOfPreferences: RestaurantTag[],
  ) {
    const restaurant_id = listOfPreferences[0].restaurant_id;
    const restaurantAlreadyExists =
      await RestaurantService.getRestaurantById(restaurant_id);

    if (restaurantAlreadyExists == null) {
      throw new Error(`Restaurant com id ${restaurant_id} não existe!`);
    }

    for (const restaurantTag of listOfPreferences) {
      const { tag_id } = restaurantTag;
      const tagExists = await TagRepository.findById(tag_id);

      if (tagExists == null) {
        throw new Error(`A tag com id ${tag_id} não existe!`);
      }
    }

    const createPromises = listOfPreferences.map((restaurantTag) => {
      const { restaurant_id, tag_id } = restaurantTag;
      return RestaurantTagRepository.create(restaurant_id, tag_id);
    });

    await Promise.all(createPromises);
  }

  static async getByRestaurantId(restaurantId: string) {
    const tags = await RestaurantTagRepository.findByRestaurantId(restaurantId);
    return tags.flatMap((tag) => tag.tag);
  }
}
