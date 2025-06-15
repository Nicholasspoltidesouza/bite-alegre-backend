import { randomUUID } from 'node:crypto';

import { Prisma } from '@prisma/client';
//import type { Express } from 'express-serve-static-core';

import {
  RestaurantDishDto,
  RestaurantDishesDto,
  RestaurantDishOutputDto,
  UpdateDishDto,
} from '../dtos/dish-dto.js';
import { RestaurantDishRepository } from '../repositories/dish-repository.js';
//import { getLocalFileUrl, uploadMediaToS3 } from '../utils/file-upload.js';

export class DishService {
  static async addDishes(
    restaurantId: string,
    dishes: RestaurantDishesDto,
    //menuMedias: Express.Multer.File[],
    menuMedias: string[],
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
    dish_photo = media;
    // if (process.env.USE_AWS_S3 === 'true') {
    //   // Modo produção - AWS S3
    //   dish_photo = await uploadMediaToS3(media);
    // } else {
    //   // Modo local - para testes
    //   dish_photo = getLocalFileUrl(media);
    // }

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

  static async syncDishes(
    restaurantId: string,
    updatedDishes: UpdateDishDto[],
    //menuMedias: Express.Multer.File[],
    menuMedias: string[],
  ): Promise<RestaurantDishOutputDto[]> {
    const existing =
      await RestaurantDishRepository.listByRestaurant(restaurantId);

    const updatedDishIds = updatedDishes.filter((d) => d.id).map((d) => d.id);
    const existingIds = existing.map((d) => d.id);

    const toDelete = existingIds.filter((id) => !updatedDishIds.includes(id));
    if (toDelete.length) {
      await RestaurantDishRepository.deleteMany(toDelete);
    }

    const created: RestaurantDishOutputDto[] = [];
    const updated: RestaurantDishOutputDto[] = [];

    let mediaIndex = 0;

    for (const dish of updatedDishes) {
      if (dish.description.length > 25) {
        throw new Error(`Description too long: ${dish.description}`);
      }

      let dish_photo: string | undefined;

      if (dish.photo && menuMedias.length > mediaIndex) {
        const media = menuMedias[mediaIndex++];
        dish_photo = media;
        // process.env.USE_AWS_S3 === 'true'
        //   ? await uploadMediaToS3(media)
        //   : getLocalFileUrl(media);
      }

      if (dish.id && existingIds.includes(dish.id)) {
        await RestaurantDishRepository.update(dish.id, {
          name: dish.name,
          dish_price: new Prisma.Decimal(dish.dish_price),
          description: dish.description,
          main_dish: dish.main_dish ?? false,
          dish_photo,
        });
        updated.push({
          ...dish,
          id: dish.id,
          restaurant_id: restaurantId,
          dish_photo:
            dish_photo || existing.find((d) => d.id === dish.id)?.dish_photo!,
        });
      } else {
        const newDish = await this.addDish(restaurantId, {
          ...dish,
          media: menuMedias[mediaIndex++],
        });
        created.push(...newDish);
      }
    }

    return [...updated, ...created];
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
