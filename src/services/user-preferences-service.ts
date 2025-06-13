import { UserPreferenceDto } from '../dtos/user-preferences-dto.js';
import { TagRepository } from '../repositories/tag-repository.js';
import { UserPreferencesRepository } from '../repositories/user-preferences-repository.js';
import { UserRepository } from '../repositories/user-repository.js';

export class UserPreferencesService {
  static async getUserPreferences(user_id: string) {
    const userExists = await UserRepository.findById(user_id);

    if (!userExists) throw new Error(`No user found with Id: ${user_id}`);

    const userPreferences =
      await UserPreferencesRepository.getUserPreferencesByUserId(user_id);

    if (userPreferences !== null) {
      return userPreferences;
    } else {
      return null;
    }
  }

  static async createUserPreferences(
    user_id: string,
    tag_id: string,
    weight: number,
  ) {
    const userAlreadyExists = await UserRepository.findById(user_id);

    if (userAlreadyExists == null) {
      throw new Error('Esse usuário não existe!');
    }

    const tagExists = await TagRepository.findById(tag_id);

    if (tagExists == null) {
      throw new Error('Essa tag não existe!');
    }

    return UserPreferencesRepository.create(user_id, tag_id, weight);
  }

  static async createUserPreferencesFromList(
    user_id: string,
    listOfTagIds: string[],
  ) {
    const userAlreadyExists = await UserRepository.findById(user_id);

    if (userAlreadyExists == null) {
      throw new Error(`Usuário com id ${user_id} não existe!`);
    }

    for (const tag_id of listOfTagIds) {
      const tagExists = await TagRepository.findById(tag_id);

      if (tagExists == null) {
        throw new Error(`A tag com id ${tag_id} não existe!`);
      }
    }

    const createPromises = listOfTagIds.map((tag_id) => {
      const weight = 1;
      return UserPreferencesRepository.create(user_id, tag_id, weight);
    });

    await Promise.all(createPromises);
  }

  static async findByUserId(id: string) {
    const userPreferences =
      await UserPreferencesRepository.findRestaurantsByUserPreferences(id);
    return UserPreferenceDto.fromEntities(userPreferences);
  }

  static async deletePreference(user_id: string, user_preference_id: string) {
    const userPreference =
      await UserPreferencesRepository.findUserPreferencesById(
        user_preference_id,
      );
    if (!userPreference) {
      throw new Error('UserPreference not found.');
    }
    if (userPreference.user_id !== user_id) {
      throw new Error('User Preference does not belong to this user.');
    }
    await UserPreferencesRepository.deleteUserPreference(userPreference);
  }

  static async addWeigh(user_id: string, tag_id: string) {
    const userPreference = await UserPreferencesRepository.findUserPreferences(
      tag_id,
      user_id,
    );
    if (!userPreference) {
      await UserPreferencesRepository.create(user_id, tag_id, 1);
    } else await UserPreferencesRepository.addWeigh(userPreference);
  }
}
