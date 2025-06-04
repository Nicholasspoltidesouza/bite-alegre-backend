import { execSync } from 'child_process';

import { config } from 'dotenv';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

declare global {
  var __TEST_CONTAINER__: StartedTestContainer | undefined;
}

export default async function globalSetup(): Promise<void> {
  config({ path: '.env.test' });

  try {
    const testContainer = await new GenericContainer('postgres:15-alpine')
      .withEnvironment({
        POSTGRES_DB: 'bite_alegre_test',
        POSTGRES_USER: 'test_user',
        POSTGRES_PASSWORD: 'test_password',
      })
      .withExposedPorts(5432)
      .withReuse()
      .start();

    const host = testContainer.getHost();
    const port = testContainer.getMappedPort(5432);
    const connectionString = `postgresql://test_user:test_password@${host}:${port}/bite_alegre_test`;

    process.env.DATABASE_URL = connectionString;

    console.log(`Database URL: ${connectionString}`);

    execSync('npx prisma migrate deploy', {
      env: { ...process.env, DATABASE_URL: connectionString },
      stdio: 'inherit',
    });

    global.__TEST_CONTAINER__ = testContainer;
  } catch (error) {
    console.error('Erro ao configurar ambiente de teste:', error);
    throw error;
  }
}
