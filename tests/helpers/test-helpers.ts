import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';

import authRoutes from '../../src/routes/auth-routes.js';
import checkinRoutes from '../../src/routes/checkin-route.js';
import favoritesRoutes from '../../src/routes/favorite-routes.js';
import feedRoutes from '../../src/routes/feed-routes.js';
import openingHourRoutes from '../../src/routes/opening-hour-routes.js';
import publicationRoutes from '../../src/routes/publication-route.js';
import restaurantRoutes from '../../src/routes/restaurant-routes.js';
import reviewRoutes from '../../src/routes/review-route.js';
import tagRoutes from '../../src/routes/tag-routes.js';
import userPreferencesRoutes from '../../src/routes/user-preferences-routes.js';
import userRoutes from '../../src/routes/user-routes.js';

export function createTestApp() {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:8081',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  app.use(express.json());

  // Registra todas as rotas
  app.use('/', restaurantRoutes);
  app.use('/', openingHourRoutes);
  app.use('/api', userRoutes);
  app.use('/api', tagRoutes);
  app.use('/api', userPreferencesRoutes);
  app.use('/', checkinRoutes);
  app.use('/', reviewRoutes);
  app.use('/api', authRoutes);
  app.use('/', feedRoutes);
  app.use('/', publicationRoutes);
  app.use('/', favoritesRoutes);

  return app;
}

export const prisma = new PrismaClient();
export const app = createTestApp();

export async function setupTestEnvironment() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must be run in test environment');
  }

  if (!process.env.DATABASE_URL?.includes('test')) {
    throw new Error('Test database URL must contain "test"');
  }
}

export async function cleanupTestEnvironment() {
  await prisma.$disconnect();
}

export async function cleanDatabase() {
  try {
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.checkin.deleteMany();
    await prisma.publication.deleteMany();
    await prisma.openingHour.deleteMany();
    await prisma.user_Preferences.deleteMany();
    await prisma.restaurantTag.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tag.deleteMany();
  } catch (error) {
    try {
      await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE "Favorite", "Review", "Checkin", "Publication", 
        "OpeningHour", "User_Preferences", "RestaurantTag", "Restaurant", 
        "User", "Tag" CASCADE;
      `);
    } catch (truncateError) {
      console.log('Database cleanup error:', { error, truncateError });
    }
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export async function createTestRestaurant(overrides: any = {}) {
  const defaultData = {
    name: 'Restaurante Teste',
    cnpj: '12345678000123',
    address: 'Rua Teste, 123 - Porto Alegre',
    email: `test-restaurant-${Date.now()}@test.com`,
    password: 'password123',
    phone: '51999999999',
    profilePhoto: 'https://example.com/photo.jpg',
    bannerPhoto: 'https://example.com/banner.jpg',
    description: 'Restaurante para testes de integração',
    average_price: 50,
    latitude: -30.0346,
    longitude: -51.2177,
    ...overrides,
  };

  return await prisma.restaurant.create({
    data: defaultData,
  });
}
