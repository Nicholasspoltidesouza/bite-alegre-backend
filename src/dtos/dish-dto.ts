import { RestaurantDish } from '@prisma/client';
//import type { Express } from 'express-serve-static-core';

export interface RestaurantDishDto {
  name: string;
  dish_price: number;
  //media?: Express.Multer.File;
  media?: string;
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
  media?: string;
}

export class RestaurantDishesOutputDto {
  id: string;
  name: string;
  dish_price: number;
  description: string;
  main_dish?: boolean;
  media?: string;

  constructor(data: RestaurantDishesOutputDto) {
    this.id = data.id;
    this.name = data.name;
    this.dish_price = data.dish_price;
    this.description = data.description;
    this.media = data.media;
  }

  static fromEntity(entity: RestaurantDish): RestaurantDishesOutputDto {
    return new RestaurantDishesOutputDto({
      id: entity.id,
      name: entity.name,
      dish_price: entity.dish_price.toNumber(),
      description: entity.description,
      media: entity.dish_photo,
    });
  }

  static fromEntities(entities: RestaurantDish[]): RestaurantDishesOutputDto[] {
    return entities.map(RestaurantDishesOutputDto.fromEntity);
  }
}
