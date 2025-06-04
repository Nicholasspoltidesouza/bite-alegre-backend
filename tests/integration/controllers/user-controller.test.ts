import request from 'supertest';

import { createTestUser } from '../../helpers/auth-helpers.js';
import { app, cleanDatabase } from '../../helpers/test-helpers.js';

describe('User Controller', () => {
  afterEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/users', () => {
    it('should create user successfully', async () => {
      const userData = {
        name: 'João Silva',
        nickname: 'joaosilva',
        email: 'joao@test.com',
        password: 'validPassword123',
        phone: '11999999999',
        gender: 'MASCULINO',
        birthDate: '1990-01-01T00:00:00.000Z',
        influencer: false,
        tagIds: [],
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
    });
  });

  describe('GET /api/users', () => {
    it('should get user profile when authenticated', async () => {
      await createTestUser();
      const token = 'Bearer test-token';

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', token)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
