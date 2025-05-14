import { PrismaClient, OpeningHour, Weekday } from '@prisma/client';

const prisma = new PrismaClient();

type Row = {
  periodId: string;
  restaurantId: string;
  weekday: Weekday;
  opensAt: Date;
  closesAt: Date;
};

export class OpeningHourRepository {
  static async bulkCreate(rows: Row[]): Promise<void> {
    if (!rows.length) return;
    await prisma.openingHour.createMany({ data: rows });
  }

  static async listByRestaurant(restaurantId: string): Promise<OpeningHour[]> {
    return prisma.openingHour.findMany({
      where: { restaurantId },
      orderBy: [{ weekday: 'asc' }, { opensAt: 'asc' }],
    });
  }

  static async deleteByPeriod(
    restaurantId: string,
    periodId: string,
  ): Promise<void> {
    await prisma.openingHour.deleteMany({
      where: { restaurantId, periodId },
    });
  }

  static async update(
    lineId: string,
    data: Partial<Pick<Row, 'opensAt' | 'closesAt'>>,
  ): Promise<OpeningHour> {
    return prisma.openingHour.update({
      where: { id: lineId },
      data,
    });
  }

  static async replacePeriod(
    restaurantId: string,
    periodId: string,
    rows: {
      weekday: Weekday;
      opensAt: Date;
      closesAt: Date;
    }[],
  ) {
    await prisma.$transaction([
      prisma.openingHour.deleteMany({ where: { restaurantId, periodId } }),
      prisma.openingHour.createMany({
        data: rows.map((r) => ({ ...r, restaurantId, periodId })),
      }),
    ]);
  }
}
