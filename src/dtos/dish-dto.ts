import { RestaurantDish } from '@prisma/client';
import type { Express } from 'express-serve-static-core';

export interface RestaurantDishDto {
  name: string;
  dish_price: number;
  media?: Express.Multer.File;
  main_dish?: boolean;
  description: string;
}

export type RestaurantDishesDto = RestaurantDishDto[];

export interface RestaurantDishOutputDto {
  id: string;
  restaurant_id: string;
  name: string;
  dish_price: number;
  dish_photo: string;
  main_dish?: boolean;
  description: string;
}

export interface UpdateDishDto {
  id?: string;
  name: string;
  dish_price: number;
  description: string;
  main_dish?: boolean;
  photo?: string;
}

export class RestaurantDishesOutputDto {
  id: string;
  dish_photo: string;

  constructor(data: RestaurantDishesOutputDto) {
    this.id = data.id;
    this.dish_photo = data.dish_photo;
  }

  static fromEntity(entity: RestaurantDish): RestaurantDishesOutputDto {
    return new RestaurantDishesOutputDto({
      id: entity.id,
      dish_photo: entity.dish_photo,
    });
  }

  static fromEntities(entities: RestaurantDish[]): RestaurantDishesOutputDto[] {
    return entities.map(RestaurantDishesOutputDto.fromEntity);
  }
}
