import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import prisma from './config/db.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

app.use(helmet());

const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        config.nodeEnv === 'development' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.json({
    name: 'SupportDesk API',
    tagline: 'Simple support. Clear resolution.',
    version: '1.0.0',
    status: 'operational',
    documentation: '/api/health',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

const isDirectRun =
  process.argv[1] &&
  fileURLToPath(import.meta.url).toLowerCase() === process.argv[1].toLowerCase();

let server;
if (isDirectRun && process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`[SupportDesk API] Running on http://localhost:${PORT}`);
    console.log(`[SupportDesk API] Environment: ${config.nodeEnv}`);
  });
}

const shutdown = async () => {
  console.log('\n[SupportDesk API] Gracefully shutting down...');
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
