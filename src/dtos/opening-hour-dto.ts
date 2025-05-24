import { OpeningHour, Weekday as PrismaWeekday } from '@prisma/client';
import { format } from 'date-fns';
export { Weekday } from '@prisma/client';
export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

// Transformado de interface para classe para adicionar métodos estáticos
export class OpeningPeriodDto {
  weekday: Weekday;
  opensAt: string;
  closesAt: string;

  constructor(data: { weekday: Weekday; opensAt: string; closesAt: string }) {
    this.weekday = data.weekday;
    this.opensAt = data.opensAt;
    this.closesAt = data.closesAt;
  }

  static fromEntity(entity: OpeningHour): OpeningPeriodDto {
    return new OpeningPeriodDto({
      weekday: entity.weekday as Weekday, // Prisma Weekday enum é compatível
      opensAt: format(entity.opensAt, 'HH:mm'), // Assuming opensAt is a Date
      closesAt: format(entity.closesAt, 'HH:mm'),
    });
  }

  static fromEntities(entities: OpeningHour[]): OpeningPeriodDto[] {
    return entities.map(OpeningPeriodDto.fromEntity);
  }
}

export type OpeningPeriodsDto = OpeningPeriodDto[];

export interface OpeningHourOutputDto {
  id: string;
  periodId: string;
  weekday: Weekday;
  opensAt: string;
  closesAt: string;
}
