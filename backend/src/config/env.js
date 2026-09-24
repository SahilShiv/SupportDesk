import dotenv from 'dotenv';
dotenv.config();

export function resolveDatabaseUrl() {
  const direct =
    process.env.DATABASE_URL_POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.STORAGE_PRISMA_URL ||
    process.env.STORAGE_URL ||
    process.env.STORAGE_DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.NEON_URL;

  if (direct) {
    return direct;
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (
      typeof value === 'string' &&
      (value.startsWith('postgres://') || value.startsWith('postgresql://'))
    ) {
      console.log(`[Database URL Resolver] Auto-detected database URL from env key: ${key}`);
      return value;
    }
  }

  return undefined;
}

const detectedDbUrl = resolveDatabaseUrl();

if (detectedDbUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = detectedDbUrl;
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
