/**
 * Mock Helpers para Testes de Integração
 *
 * Este arquivo contém exemplos de como mockar dependências externas
 * durante os testes. Use apenas quando necessário para seu controller específico.
 */

import { jest } from '@jest/globals';

/**
 * Exemplo: Mock de uma API externa genérica
 * Use este padrão quando seu controller depender de APIs de terceiros
 */
export const mockExternalApi = (
  modulePath: string,
  mockImplementation: any,
) => {
  jest.mock(modulePath, () => mockImplementation);
};

/**
 * Limpa todos os mocks - útil entre testes
 */
export const clearAllMocks = () => {
  jest.clearAllMocks();
};

/**
 * EXEMPLOS DE USO:
 *
 * 1. Mock básico do geocoding:
 * ```typescript
 * import { mockGeocodingService } from '../../helpers/mock-helpers';
 *
 * describe('Restaurant Controller', () => {
 *   beforeAll(() => {
 *     mockGeocodingService();
 *   });
 * });
 * ```
 *
 * 2. Mock com valores específicos:
 * ```typescript
 * const mockGeocoding = mockGeocodingService();
 * mockGeocoding.geocodeAddress.mockResolvedValueOnce({
 *   lat: -23.5505,
 *   lng: -46.6333
 * });
 * ```
 *
 * 3. Mock de API externa:
 * ```typescript
 * mockExternalApi('https://api.example.com', {
 *   '/users': { users: [] },
 *   '/status': { status: 'ok' }
 * });
 * ```
 */
