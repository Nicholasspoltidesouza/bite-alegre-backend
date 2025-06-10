import { CreateFavoriteDto, FavoriteOutputDto } from '../dtos/favorite-dto.js';
import { FavoriteRepository } from '../repositories/favorite-repository.js';
import { RestaurantRepository } from '../repositories/restaurant-repository.js';
import { UserRepository } from '../repositories/user-repository.js';

export class FavoriteService {
  static async createFavorite(input: CreateFavoriteDto) {
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

    const existingFavorite = await FavoriteRepository.findFavorite(
      user_id,
      restaurant_id,
    );
    if (existingFavorite) {
      throw new Error('Este restaurante ja foi adicionado aos favoritos!');
    }

    const favorite = await FavoriteRepository.create({
      ...input,
    });

    return FavoriteOutputDto.fromEntity(favorite);
  }

  static async deleteFavorite(input: CreateFavoriteDto) {
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

    const existingFavorite = await FavoriteRepository.findFavorite(
      user_id,
      restaurant_id,
    );
    if (!existingFavorite) {
      throw new Error('Este restaurante não está nos favoritos!');
    }

    await FavoriteRepository.delete(existingFavorite.id);
  }

  static async getUserFavoriteIds(userId: string): Promise<string[]> {
    const favorites = await FavoriteRepository.findByUserId(userId);
    return favorites.map((fav) => fav.restaurant_id);
  }
}
