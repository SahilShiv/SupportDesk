import * as ticketService from '../services/ticketService.js';
import { sendSuccess } from '../utils/response.js';

export async function getDashboardStats(req, res, next) {
  try {
    const stats = await ticketService.getDashboardStats();
    return sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
}
