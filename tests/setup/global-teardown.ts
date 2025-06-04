import { StartedTestContainer } from 'testcontainers';

declare global {
  var __TEST_CONTAINER__: StartedTestContainer | undefined;
}

export default async function globalTeardown(): Promise<void> {
  try {
    const testContainer = global.__TEST_CONTAINER__;

    if (testContainer) {
      await testContainer.stop();
      console.log('Container PostgreSQL parado com sucesso');
    }

    delete global.__TEST_CONTAINER__;
  } catch (error) {
    console.error('Erro ao limpar ambiente de teste:', error);
  }
}
