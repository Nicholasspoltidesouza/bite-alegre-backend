import {
  publicationRequestDto,
  publicationResponseDto,
  PublicationListItemDto,
  PublicationOutputDto,
} from '../dtos/publication-dto.js';
import { RestaurantFilterDto } from '../dtos/restaurant-dto.js';
import { PublicationRepository } from '../repositories/publication-repository.js';
import { RestaurantRepository } from '../repositories/restaurant-repository.js';
import { UserRepository } from '../repositories/user-repository.js';
import { uploadMediaToS3, getLocalFileUrl } from '../utils/file-upload.js';

export class PublicationService {
  static async create(
    input: publicationRequestDto,
    user_id: string,
  ): Promise<publicationResponseDto> {
    const { media, description, restaurant_id } = input;

    if (!media) {
      throw new Error('Mídia não pode ser vazia!');
    }
    if (!description) {
      throw new Error('Descrição não pode ser vazia!');
    }
    if (!restaurant_id) {
      throw new Error('Restaurante não pode ser vazio!');
    }

    console.log('Buscando restaurante com ID:', restaurant_id);
    const existingRestaurant =
      await RestaurantRepository.findOne(restaurant_id);
    console.log('Restaurante encontrado:', existingRestaurant ? 'SIM' : 'NÃO');
    if (!existingRestaurant) {
      throw new Error('Restaurante não encontrado!');
    }
    const existingUser = await UserRepository.findById(user_id);
    if (!existingUser) {
      throw new Error('Usuário não encontrado!');
    }

    let url: string;

    if (process.env.USE_AWS_S3 === 'true') {
      // Modo produção - AWS S3
      url = await uploadMediaToS3(media);
    } else {
      // Modo local - para testes
      url = getLocalFileUrl(media);
    }

    const publicationEntity = await PublicationRepository.create(
      {
        description,
        restaurant_id,
        url,
      },
      user_id,
    );

    return publicationResponseDto.fromEntity(publicationEntity);
  }

  static async getPostById(id: string) {
    const post = await PublicationRepository.findOne(id);
    if (!post) {
      throw new Error('Post not found.');
    }
    return PublicationOutputDto.fromEntity(post);
  }

  static async listByUser(filters: RestaurantFilterDto, userId: string) {
    const restaurantsPosts =
      await PublicationRepository.findRestaurants(userId);
    const restaurants = await RestaurantRepository.findByFilters(
      filters,
      restaurantsPosts,
    );
    const posts = await PublicationRepository.findByUser(
      restaurants.map((r) => r.id),
      userId,
    );
    return PublicationListItemDto.fromEntities(posts);
  }
}
