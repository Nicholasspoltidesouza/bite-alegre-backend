import {
  publicationRequestDto,
  publicationResponseDto,
} from '../dtos/publication-dto.js';
import { PublicationRepository } from '../repositories/publication-repository.js';
import { RestaurantRepository } from '../repositories/restaurant-repository.js';
import { UserRepository } from '../repositories/user-repository.js';

export class PublicationService {
  static async create(
    input: publicationRequestDto,
  ): Promise<publicationResponseDto> {
    const { media, description, restaurant_id, user_id } = input;

    if (!media || !description || !restaurant_id) {
      throw new Error('Required fields: media, description, restaurant');
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

    const addMediaEntity = await PublicationRepository.create({
      ...input,
    });

    return publicationResponseDto.fromEntity(addMediaEntity);
  }
}
