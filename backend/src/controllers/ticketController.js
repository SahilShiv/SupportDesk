import * as ticketService from '../services/ticketService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function createTicket(req, res, next) {
  try {
    const ticketData = req.validatedBody;
    const createdTicket = await ticketService.createTicket(ticketData);

    return sendSuccess(
      res,
      {
        ticket_id: createdTicket.ticket_id,
        created_at: createdTicket.created_at,
        customer_name: createdTicket.customer_name,
        subject: createdTicket.subject,
        status: createdTicket.status,
        priority: createdTicket.priority,
      },
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function getTickets(req, res, next) {
  try {
    const { page, limit, search, status, priority, sort, needsAttention } = req.validatedQuery;
    const { tickets, pagination } = await ticketService.getTickets({
      page,
      limit,
      search,
      status,
      priority,
      sort,
      needsAttention,
    });

    return sendSuccess(res, tickets, 200, pagination);
  } catch (err) {
    next(err);
  }
}

export async function getTicketById(req, res, next) {
  try {
    const { ticket_id } = req.params;
    const ticket = await ticketService.getTicketByTicketId(ticket_id);

    if (!ticket) {
      return sendError(res, 'Ticket not found', 404);
    }

    return sendSuccess(res, ticket);
  } catch (err) {
    next(err);
  }
}

export async function updateTicket(req, res, next) {
  try {
    const { ticket_id } = req.params;
    const updateData = req.validatedBody;

    const updated = await ticketService.updateTicket(ticket_id, updateData);

    if (!updated) {
      return sendError(res, 'Ticket not found', 404);
    }

    return sendSuccess(res, {
      updated_at: updated.updated_at,
    });
  } catch (err) {
    next(err);
  }
}
