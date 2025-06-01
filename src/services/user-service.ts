import {
  CreateUserDto,
  UserOutputDto,
  UserSearchOutputDto,
} from '../dtos/user-dto.js';
import { UserRepository } from '../repositories/user-repository.js';
import { hashPassword } from '../utils/crypto.js';

import { CheckinService } from './checkin-service.js';
import { FavoriteService } from './favorite-service.js';
import { RestaurantService } from './restaurant-service.js';
import { ReviewService } from './review-service.js';
import { UserPreferencesService } from './user-preferences-service.js';

export class UserService {
  static async createUser(input: CreateUserDto) {
    const {
      profilePhoto,
      name,
      nickname,
      email,
      password,
      phone,
      gender,
      influencer,
      birthDate,
      tagIds,
    } = input;

    const userAlreadyExists = await UserRepository.findByEmail(email);
    const hashedPassword = await hashPassword(password);
    const allowedGenders = await UserRepository.getAllowedGenders();
    const nicknameAlreadyExists = await UserRepository.findByNickname(nickname);

    if (!allowedGenders.includes(gender)) {
      throw new Error('Gênero inválido');
    }

    if (userAlreadyExists != null) {
      throw new Error('Esse email já está sendo utilizado');
    }

    if (nicknameAlreadyExists != null) {
      throw new Error('Esse nickname já está sendo utilizado');
    }

    const userCreated = await UserRepository.create(
      name,
      nickname,
      email,
      hashedPassword,
      gender,
      birthDate,
      phone,
      profilePhoto,
      influencer,
    );
    if (tagIds && tagIds.length > 0) {
      try {
        await UserPreferencesService.createUserPreferencesFromList(
          userCreated.id,
          tagIds,
        );
      } catch (error) {
        console.error('Failed to create user preferences:', error);
        throw new Error('Falha ao criar preferências do usuário');
      }
    }
    return userCreated;
  }

  static async filterByUsersByNickname(nickname: string) {
    const users = await UserRepository.findByName(nickname);
    return UserSearchOutputDto.fromEntities(users);
  }

  static async getUserById(id: string): Promise<UserOutputDto> {
    const user = await UserRepository.findOne(id);
    if (!user) throw new Error('User not found.');

    const reviewEntities = await ReviewService.findByUserId(id);

    const checkinEntities = await CheckinService.findByUserId(id);

    const favorites = await FavoriteService.getFavoritesForUser(id);

    const restaurantIds = favorites.map((fav) => fav.restaurant_id);

    const savedRestaurants =
      await RestaurantService.getRestaurantsWithReviewsByIds(restaurantIds);

    return UserOutputDto.fromEntity(
      user,
      reviewEntities,
      checkinEntities,
      savedRestaurants,
    );
  }
}
