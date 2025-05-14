export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export interface OpeningPeriodDto {
  weekday: Weekday;
  opensAt: string;
  closesAt: string;
}

export type OpeningPeriodsDto = OpeningPeriodDto[];

export interface OpeningHourOutputDto {
  id: string;
  periodId: string;
  weekday: Weekday;
  opensAt: string;
  closesAt: string;
}
