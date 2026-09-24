import { PrismaClient } from '@prisma/client';
import { resolveDatabaseUrl } from './env.js';

const databaseUrl = resolveDatabaseUrl() || process.env.DATABASE_URL;

if (databaseUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  datasources: databaseUrl
    ? {
        db: {
          url: databaseUrl,
        },
      }
    : undefined,
});

export default prisma;
