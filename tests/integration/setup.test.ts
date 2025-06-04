import request from 'supertest';

import { createTestApp } from '../helpers/test-helpers.js';

const app = createTestApp();

describe('Setup de Integração', () => {
  it('deve criar aplicação de teste com sucesso', () => {
    expect(app).toBeDefined();
  });

  it('deve responder à requisição básica', async () => {
    await request(app)
      .get('/api/health')
      .expect((res) => {
        expect(res.status).toBeGreaterThanOrEqual(200);
      });
  });

  it('deve ter as variáveis de ambiente configuradas', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBeDefined();
  });
});
