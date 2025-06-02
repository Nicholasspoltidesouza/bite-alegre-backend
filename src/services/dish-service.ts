import { randomUUID } from 'node:crypto';

import {
  RestaurantDishDto,
  RestaurantDishesDto,
  RestaurantDishOutputDto,
} from '../dtos/dish-dto.js';
import { RestaurantDishRepository } from '../repositories/dish-repository.js';

export class DishService {
  static async addDishes(
    restaurantId: string,
    dishes: RestaurantDishesDto,
  ): Promise<RestaurantDishOutputDto[]> {
    const allCreated: RestaurantDishOutputDto[] = [];

    for (const dish of dishes) {
      const created = await this.addDish(restaurantId, dish);
      allCreated.push(...created);
    }

    return allCreated;
  }

  static async addDish(
    restaurant_id: string,
    dto: RestaurantDishDto,
  ): Promise<RestaurantDishOutputDto[]> {
    const { name, dish_price, dish_photo, main_dish, description } = dto;

    if (!name || !dish_price || dish_photo || description) {
      throw new Error(
        'name, dish_price, dish_photo and description must be provided',
      );
    }

    const id = randomUUID();

    const rows = [
      {
        id,
        restaurant_id,
        name,
        dish_price,
        dish_photo,
        main_dish: main_dish ?? false,
        description,
      },
    ];
    await RestaurantDishRepository.bulkCreate(rows);

    const stored =
      await RestaurantDishRepository.listByRestaurant(restaurant_id);
    return stored.filter((r) => r.id === id).map(this.toDto);
  }

  private static toDto(row: {
    id: string;
    restaurant_id: string;
    name: string;
    dish_price: any;
    dish_photo: string;
    main_dish: boolean;
    description: string;
  }): RestaurantDishOutputDto {
    return {
      id: row.id,
      restaurant_id: row.restaurant_id,
      name: row.name,
      dish_price: row.dish_price,
      dish_photo: row.dish_photo,
      main_dish: row.main_dish,
      description: row.description,
    };
  }
}
