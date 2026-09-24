import { Router } from 'express';
import ticketRoutes from './ticketRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import healthRoutes from './healthRoutes.js';

const apiRouter = Router();

apiRouter.use('/tickets', ticketRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/', healthRoutes);

export default apiRouter;
