import { PrismaClient } from '@prisma/client';
import './env.js';

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.STORAGE_PRISMA_URL ||
  process.env.STORAGE_URL ||
  process.env.STORAGE_DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_URL;

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
