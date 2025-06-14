import {
  CreateUserDto,
  UserOutputDto,
  UserSearchOutputDto,
  UpdateUserDto,
  UserEditOutputDto,
} from '../dtos/user-dto.js';
import { CheckinRepository } from '../repositories/checkin-repository.js';
import { ReviewRepository } from '../repositories/review-repository.js';
import { UserRepository } from '../repositories/user-repository.js';
import { hashPassword } from '../utils/crypto.js';

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

  static async updateUser(userId: string, data: UpdateUserDto) {
    const updatedUser = await UserRepository.update(userId, data);

    if (data.tagIds && data.tagIds.length > 0) {
      await UserRepository.updateTags(userId, data.tagIds);
    }

    return updatedUser;
  }

  static async filterByUsersByNickname(nickname: string) {
    const users = await UserRepository.findByName(nickname);
    return UserSearchOutputDto.fromEntities(users);
  }

  static async getUserById(id: string): Promise<UserOutputDto> {
    const user = await UserRepository.findOne(id);
    if (!user) throw new Error('User not found.');

    const reviewEntities = await ReviewRepository.findByUserId(id);

    const checkinEntities = await CheckinRepository.findByUserId(id);

    return UserOutputDto.fromEntity(
      user,
      user.favorites,
      reviewEntities,
      checkinEntities,
    );
  }

  static async findUserParameters(id: string): Promise<UserEditOutputDto> {
    console.log('Buscando usuário com ID:', id);
    const user = await UserRepository.findOneBasic(id);
    if (!user) throw new Error('User not found' + id);
    return UserEditOutputDto.fromEntity(user);
  }
}
