import prisma from '../config/db.js';

export async function getHealth(req, res) {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = err.message || 'error';
  }

  return res.status(200).json({
    status: 'ok',
    service: 'SupportDesk API',
    database: dbStatus,
  });
}
