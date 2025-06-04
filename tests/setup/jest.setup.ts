import { config } from 'dotenv';

config({ path: '.env.test' });

console.log('Configuração de teste carregada');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(
  `DATABASE_URL: ${process.env.DATABASE_URL ? 'Definida' : 'Não definida'}`,
);

if (!process.env.DATABASE_URL) {
  console.warn(
    'DATABASE_URL não definida. Certifique-se de ter um banco PostgreSQL disponível.',
  );
}
