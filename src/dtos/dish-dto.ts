export interface RestaurantDishDto {
  name: string;
  dish_price: number;
  dish_photo: string;
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
