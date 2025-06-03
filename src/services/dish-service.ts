import { randomUUID } from 'node:crypto';

import { Prisma } from '@prisma/client';
import type { Express } from 'express-serve-static-core';

import {
  RestaurantDishDto,
  RestaurantDishesDto,
  RestaurantDishOutputDto,
} from '../dtos/dish-dto.js';
import { RestaurantDishRepository } from '../repositories/dish-repository.js';
import { getLocalFileUrl, uploadMediaToS3 } from '../utils/file-upload.js';

export class DishService {
  static async addDishes(
    restaurantId: string,
    dishes: RestaurantDishesDto,
    menuMedias: Express.Multer.File[],
  ): Promise<RestaurantDishOutputDto[]> {
    const allCreated: RestaurantDishOutputDto[] = [];

    if (dishes.length !== menuMedias.length) {
      throw new Error('O número de mídias deve ser igual ao número de pratos.');
    }

    for (let i = 0; i < dishes.length; i++) {
      dishes[i].media = menuMedias[i];
    }

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
    const { name, dish_price, main_dish, media, description } = dto;

    if (!name || !dish_price || !media || !description) {
      throw new Error(
        'name, dish_price, media and description must be provided',
      );
    }

    if (main_dish) {
      await RestaurantDishRepository.changeMainDish(restaurant_id);
    }

    const id = randomUUID();

    let dish_photo: string;

    if (process.env.USE_AWS_S3 === 'true') {
      // Modo produção - AWS S3
      dish_photo = await uploadMediaToS3(media);
    } else {
      // Modo local - para testes
      dish_photo = getLocalFileUrl(media);
    }

    const rows = [
      {
        id,
        restaurant_id,
        name,
        dish_price: new Prisma.Decimal(dish_price),
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
    dish_price: Prisma.Decimal;
    dish_photo: string;
    main_dish: boolean;
    description: string;
  }): RestaurantDishOutputDto {
    return {
      id: row.id,
      restaurant_id: row.restaurant_id,
      name: row.name,
      dish_price: row.dish_price.toNumber(),
      dish_photo: row.dish_photo,
      main_dish: row.main_dish,
      description: row.description,
    };
  }
}
