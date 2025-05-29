import { CreateReviewDto, ReviewOutputDto } from '../dtos/review-dto.js';
import { CheckinRepository } from '../repositories/checkin-repository.js';
import { RestaurantRepository } from '../repositories/restaurant-repository.js';
import { ReviewRepository } from '../repositories/review-repository.js';
import { UserRepository } from '../repositories/user-repository.js';

export class ReviewService {
  static async createReview(input: CreateReviewDto) {
    const { user_id, restaurant_id, stars } = input;

    if (!user_id || !restaurant_id || stars === undefined) {
      throw new Error(
        'Campos obrigatórios: user_id, restaurant_id, stars, feedback.',
      );
    }

    if (stars < 0 || stars > 5 || !Number.isFinite(stars)) {
      throw new Error(
        'A nota deve ser um número entre 0 e 5 com uma casa decimal.',
      );
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

    let existingCheckin = await CheckinRepository.findCheckin(
      user_id,
      restaurant_id,
    );
    if (!existingCheckin) {
      existingCheckin = await CheckinRepository.create({
        user_id,
        restaurant_id,
        time_at: new Date(),
      });
    }

    const review = await ReviewRepository.create({ ...input });

    return ReviewOutputDto.fromEntity(review);
  }

  static async findByUserId(userId: string) {
    const reviews = await ReviewRepository.findByUserId(userId);
    return reviews;
  }
}
