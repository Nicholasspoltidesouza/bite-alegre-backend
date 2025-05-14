import { User_Preferences } from '@prisma/client';

export class UserPreferenceDto {
  user_id: string;
  tag_id: string;
  weight: number;
  constructor(data: UserPreferenceDto) {
    this.user_id = data.user_id;
    this.tag_id = data.tag_id;
    this.weight = data.weight;
  }

  static fromEntity(entity: User_Preferences): UserPreferenceDto {
    return new UserPreferenceDto({
      user_id: entity.user_id,
      tag_id: entity.tag_id,
      weight: entity.weight,
    });
  }

  static fromEntities(entities: User_Preferences[]): UserPreferenceDto[] {
    return entities.map(UserPreferenceDto.fromEntity);
  }
}
