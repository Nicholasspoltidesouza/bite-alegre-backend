import { randomUUID } from 'node:crypto';

import { parse, format, isValid } from 'date-fns';

import {
  OpeningPeriodDto,
  OpeningHourOutputDto,
  OpeningPeriodsDto,
  Weekday,
} from '../dtos/opening-hour-dto.js';
import { OpeningHourRepository } from '../repositories/opening-hour-repository.js';

export class OpeningHourService {
  private static toTime(hhmm: string): Date {
    const d = parse(hhmm, 'HH:mm', new Date('1970-01-01T00:00:00Z'));
    if (!isValid(d)) {
      throw new Error(`Invalid time: ${hhmm}`);
    }
    return d;
  }

  private static nextWeekday(day: Weekday): Weekday {
    const order: Weekday[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return order[(order.indexOf(day) + 1) % 7];
  }

  private static toDto(row: {
    id: string;
    periodId: string;
    weekday: Weekday;
    opensAt: Date;
    closesAt: Date;
  }): OpeningHourOutputDto {
    return {
      id: row.id,
      periodId: row.periodId,
      weekday: row.weekday,
      opensAt: format(row.opensAt, 'HH:mm'),
      closesAt: format(row.closesAt, 'HH:mm'),
    };
  }

  static async addPeriod(
    restaurantId: string,
    dto: OpeningPeriodDto,
  ): Promise<OpeningHourOutputDto[]> {
    const { weekday, opensAt, closesAt } = dto;

    if (!opensAt || !closesAt) {
      throw new Error('opensAt and closesAt must be provided');
    }

    const opens = this.toTime(opensAt);
    const closes = this.toTime(closesAt);
    const periodId = randomUUID();

    const rows =
      closes > opens
        ? [
            {
              periodId,
              restaurantId,
              weekday,
              opensAt: opens,
              closesAt: closes,
            },
          ]
        : [
            {
              periodId,
              restaurantId,
              weekday,
              opensAt: opens,
              closesAt: this.toTime('23:59'),
            },
            {
              periodId,
              restaurantId,
              weekday: this.nextWeekday(weekday),
              opensAt: this.toTime('00:00'),
              closesAt: closes,
            },
          ];

    await OpeningHourRepository.bulkCreate(rows);

    const stored = await OpeningHourRepository.listByRestaurant(restaurantId);
    return stored.filter((r) => r.periodId === periodId).map(this.toDto);
  }

  static async addPeriods(
    restaurantId: string,
    periods: OpeningPeriodsDto,
  ): Promise<OpeningHourOutputDto[]> {
    const allCreated: OpeningHourOutputDto[] = [];

    for (const period of periods) {
      const created = await this.addPeriod(restaurantId, period);
      allCreated.push(...created);
    }

    return allCreated;
  }

  static async listByRestaurant(
    restaurantId: string,
  ): Promise<OpeningHourOutputDto[]> {
    const rows = await OpeningHourRepository.listByRestaurant(restaurantId);
    return rows.map(this.toDto);
  }

  static async updatePeriod(
    restaurantId: string,
    periodId: string,
    dto: OpeningPeriodDto,
  ): Promise<OpeningHourOutputDto[]> {
    const { weekday, opensAt, closesAt } = dto;

    const openDate = this.toTime(opensAt);
    const closeDate = this.toTime(closesAt);

    const rows =
      closeDate > openDate
        ? [{ weekday, opensAt: openDate, closesAt: closeDate }]
        : [
            {
              weekday,
              opensAt: openDate,
              closesAt: this.toTime('23:59'),
            },
            {
              weekday: this.nextWeekday(weekday),
              opensAt: this.toTime('00:00'),
              closesAt: closeDate,
            },
          ];

    await OpeningHourRepository.replacePeriod(restaurantId, periodId, rows);

    const stored = await OpeningHourRepository.listByRestaurant(restaurantId);
    return stored.filter((r) => r.periodId === periodId).map(this.toDto);
  }

  static async deletePeriod(
    restaurantId: string,
    periodId: string,
  ): Promise<void> {
    await OpeningHourRepository.deleteByPeriod(restaurantId, periodId);
  }
}
