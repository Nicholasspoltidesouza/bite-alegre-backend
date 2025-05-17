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
    user_id: string,
  ): Promise<publicationResponseDto> {
    const { media, description, restaurant_id } = input;

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

    // upload pro S3
    // const url = await uploadMediaToS3(media);

    const url = media; // Placeholder

    const publicationEntity = await PublicationRepository.create(
      {
        ...input,
        restaurant_id,
        url,
      },
      user_id,
    );

    return publicationResponseDto.fromEntity(publicationEntity);
  }
}
