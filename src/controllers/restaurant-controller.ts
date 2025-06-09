import { Request, Response } from 'express';
import type { Express } from 'express-serve-static-core';

import { RestaurantDishDto, RestaurantDishesDto } from '../dtos/dish-dto.js';
import { RestaurantFilterDto } from '../dtos/restaurant-dto.js';
import { AuthenticatedRequest } from '../middlewares/authenticate.js';
import { RestaurantService } from '../services/restaurant-service.js';
import { RestaurantTagService } from '../services/restaurant-tag-service.js';

export class RestaurantController {
  static async create(req: Request, res: Response) {
    try {
      const {
        profilePhoto,
        bannerPhoto,
        name,
        cnpj,
        description,
        address,
        email,
        password,
        averagePrice,
        phone,
        tagIds,
        openingPeriods,
      } = req.body;

      let menuItems: RestaurantDishesDto | undefined = undefined;

      if (req.body.menuItems && req.body.menuItems !== 'undefined') {
        menuItems = JSON.parse(req.body.menuItems);
      }

      const menuMedias = req.files as Express.Multer.File[];

      const restaurant = await RestaurantService.createRestaurant({
        profilePhoto,
        bannerPhoto,
        name,
        cnpj,
        description,
        address,
        email,
        password,
        averagePrice,
        phone,
        tagIds,
        openingPeriods,
        menuItems,
        menuMedias,
      });

      res.status(201).json(restaurant);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      res.status(500).json({ error: 'Failed to create restaurant' });
    }
  }

  static async edit(req: Request, res: Response) {
    const { sub: restaurantId } = (req as AuthenticatedRequest).user;

    const {
      profilePhoto,
      name,
      description,
      address,
      email,
      averagePrice,
      phone,
      openingPeriods,
      tags,
    } = req.body;

    try {
      let menuItems: RestaurantDishDto[] | undefined = undefined;

      if (req.body.menuItems && req.body.menuItems !== 'undefined') {
        menuItems = JSON.parse(req.body.menuItems);
      }

      const files = req.files as { [field: string]: Express.Multer.File[] };
      const menuMedias = files?.menuMedias ?? [];

      const updatedRestaurant = await RestaurantService.updateRestaurant({
        restaurantId,
        profilePhoto,
        name,
        description,
        address,
        email,
        averagePrice,
        phone,
        openingPeriods,
        tags,
        menuItems,
        menuMedias,
      });

      if (!updatedRestaurant) {
        res.status(404).json({ error: 'Restaurante não encontrado' });
      }

      res.status(200).json({
        message: 'Restaurante atualizado com sucesso',
        data: updatedRestaurant,
      });
    } catch (error) {
      console.error('Erro ao atualizar restaurante:', error);
      res
        .status(500)
        .json({ error: 'Erro interno ao atualizar o restaurante' });
    }
  }

  static async list(req: Request, res: Response) {
    const geo = req.query.geolocation?.toString().split(',').map(Number);

    const filters: RestaurantFilterDto = {
      name: req.query.name?.toString(),
      address: req.query.address?.toString(),
      geolocation: geo && geo.length === 2 ? [geo[0], geo[1]] : undefined,
      proximity: req.query.proximity
        ? Number(req.query.proximity)
        : req.query.address
          ? 5
          : undefined,
      price_range: req.query.price_range
        ? Number(req.query.price_range)
        : undefined,
      tags: req.query.tags ? req.query.tags.toString().split(',') : undefined,
      open_now: req.query.open_now === 'true',
    };

    try {
      const restaurants = await RestaurantService.getRestaurants(filters);
      res.status(200).json(restaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
  }

  static async find(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantService.getRestaurantById(id);

      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found' });
      }

      res.status(200).json(restaurant);
    } catch (error) {
      console.error('Error finding one restaurant:', error);
      res.status(500).json({ error: 'Failed to find restaurant' });
    }
  }

  static async randomDraw(req: Request, res: Response) {
    const { sub: id } = (req as AuthenticatedRequest).user;

    const filters: RestaurantFilterDto = {
      price_range: req.query.price_range
        ? Number(req.query.price_range)
        : undefined,
      tags: req.query.tags ? req.query.tags.toString().split(',') : undefined,
    };

    try {
      const restaurant = await RestaurantService.getRandomRestaurant(
        id,
        filters,
      );

      if (!restaurant) {
        res.status(404).json({ error: 'Restaurant not found' });
        return;
      }

      res.status(200).json(restaurant);
    } catch (error) {
      console.error('Error finding one restaurant:', error);
      res.status(500).json({ error: 'Failed to find restaurant' });
    }
  }

  static async getTags(req: Request, res: Response) {
    const { sub: restaurantId } = (req as AuthenticatedRequest).user;

    try {
      const tags = await RestaurantTagService.getByRestaurantId(restaurantId);

      if (!tags.length) {
        res.status(200).json({
          message: 'O restaurante não possui nenhuma tag associada',
          tags,
        });
      }

      res.status(200).json(tags);
    } catch (error) {
      console.error('Erro ao buscar tags do restaurante:', error);
      res.status(500).json({ error: 'Erro ao buscar tags do restaurante' });
    }
  }

  static async deleteDish(req: Request, res: Response) {
    const { sub: restaurantId } = (req as AuthenticatedRequest).user;
    const { item_id } = req.params;
    try {
      await RestaurantService.deleteDish(restaurantId, item_id);

      res.status(200).json({
        message: 'Item do menu deletado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar o item do menu do restaurante:', error);
      res
        .status(500)
        .json({ error: 'Erro ao deletar o item do menu do restaurante' });
    }
  }
}
