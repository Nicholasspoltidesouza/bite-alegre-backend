import { Checkin } from '@prisma/client';

export interface CreateCheckinDto {
  user_id: string;
  restaurant_id: string;
  time_at?: Date;
}

export class CheckinOutputDto {
  id: string;
  user_id: string;
  restaurant_id: string;
  time_at: Date;

  constructor(data: CheckinOutputDto) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.restaurant_id = data.restaurant_id;
    this.time_at = data.time_at;
  }

  static fromEntity(entity: Checkin): CheckinOutputDto {
    return new CheckinOutputDto({
      id: entity.id,
      user_id: entity.user_id,
      restaurant_id: entity.restaurant_id,
      time_at: entity.time_at,
    });
  }

  static fromEntities(entities: Checkin[]): CheckinOutputDto[] {
    return entities.map(CheckinOutputDto.fromEntity);
  }
}
