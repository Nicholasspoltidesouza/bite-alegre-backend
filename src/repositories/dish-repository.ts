import { PrismaClient, RestaurantDish } from '@prisma/client';

const prisma = new PrismaClient();

type Row = {
  id: string;
  restaurant_id: string;
  name: string;
  dish_price: number;
  dish_photo: string;
  main_dish: boolean;
  description: string;
};

export class RestaurantDishRepository {
  static async bulkCreate(rows: Row[]): Promise<void> {
    if (!rows.length) return;
    await prisma.restaurantDish.createMany({ data: rows });
  }

  static async listByRestaurant(
    restaurant_id: string,
  ): Promise<RestaurantDish[]> {
    return prisma.restaurantDish.findMany({
      where: { restaurant_id },
    });
  }
}
