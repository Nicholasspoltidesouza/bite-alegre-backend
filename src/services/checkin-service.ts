import { CreateCheckinDto, CheckinOutputDto } from '../dtos/checkin-dto.js';
import { CheckinRepository } from '../repositories/checkin-repository.js';
import { RestaurantRepository } from '../repositories/restaurant-repository.js';
import { UserRepository } from '../repositories/user-repository.js';

export class CheckinService {
  static async createCheckin(input: CreateCheckinDto) {
    const { user_id, restaurant_id } = input;

    if (!user_id || !restaurant_id) {
      throw new Error('Campos obrigatórios: user_id, restaurant_id.');
    }

    const existingRestaurant =
      await RestaurantRepository.findOne(restaurant_id);
    if (!existingRestaurant) {
      throw new Error('Restaurante não encontrado!');
    }

    const existingUser = await UserRepository.findById(user_id);
    if (!existingUser) {
      throw new Error('Usuário não encontrado!');
    }

    const checkin = await CheckinRepository.create({
      ...input,
    });

    return CheckinOutputDto.fromEntity(checkin);
  }

  static async findByUserId(userId: string) {
    return CheckinRepository.findByUserId(userId);
  }
}
