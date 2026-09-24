import { Router } from 'express';
import * as ticketController from '../controllers/ticketController.js';
import { validateBody, validateQuery } from '../middleware/validateRequest.js';
import {
  createTicketSchema,
  updateTicketSchema,
  ticketQuerySchema,
} from '../validators/ticketValidators.js';

const router = Router();

router.post('/', validateBody(createTicketSchema), ticketController.createTicket);
router.get('/', validateQuery(ticketQuerySchema), ticketController.getTickets);
router.get('/:ticket_id', ticketController.getTicketById);
router.put('/:ticket_id', validateBody(updateTicketSchema), ticketController.updateTicket);

export default router;
