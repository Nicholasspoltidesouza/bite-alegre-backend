import request from 'supertest';

import {
  createTestUser,
  createTestRestaurant,
} from '../../helpers/auth-helpers.js';
import { app, cleanDatabase } from '../../helpers/test-helpers.js';

describe('Auth Controller', () => {
  afterEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      await createTestUser({
        email: 'user@test.com',
        password: 'validPassword123',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'validPassword123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('user@test.com');
    });

    it('should login restaurant successfully', async () => {
      await createTestRestaurant({
        email: 'restaurant@test.com',
        password: 'validPassword123',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'restaurant@test.com',
          password: 'validPassword123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@test.com',
          password: 'wrongPassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
