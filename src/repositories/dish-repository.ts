import { Prisma, PrismaClient, RestaurantDish } from '@prisma/client';

const prisma = new PrismaClient();

type Row = {
  id: string;
  restaurant_id: string;
  name: string;
  dish_price: Prisma.Decimal;
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

  static async changeMainDish(restaurantId: string) {
    await prisma.restaurantDish.updateMany({
      where: {
        restaurant_id: restaurantId,
        main_dish: true,
      },
      data: {
        main_dish: false,
      },
    });
  }

  static async update(id: string, data: Partial<Row>): Promise<void> {
    await prisma.restaurantDish.update({
      where: { id },
      data,
    });
  }

  static async deleteMany(ids: string[]): Promise<void> {
    if (!ids.length) return;

    await prisma.restaurantDish.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
