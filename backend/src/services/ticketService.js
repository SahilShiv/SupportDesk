import prisma from '../config/db.js';
import { generateTicketId } from './ticketIdGenerator.js';
import { NEEDS_ATTENTION_HOURS } from '../constants/index.js';

export async function createTicket(data) {
  return await prisma.$transaction(async (tx) => {
    const ticketId = await generateTicketId(tx);

    const ticket = await tx.ticket.create({
      data: {
        ticket_id: ticketId,
        customer_name: data.customer_name.trim(),
        customer_email: data.customer_email.trim().toLowerCase(),
        subject: data.subject.trim(),
        description: data.description.trim(),
        status: data.status || 'Open',
        priority: data.priority || 'Medium',
        order_reference: data.order_reference?.trim() || null,
      },
    });

    return ticket;
  });
}

export async function getTickets({ page = 1, limit = 10, search, status, priority, sort = 'newest', needsAttention }) {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (needsAttention === 'true') {
    const cutoffDate = new Date(Date.now() - NEEDS_ATTENTION_HOURS * 60 * 60 * 1000);
    where.created_at = { lte: cutoffDate };
    if (!status) {
      where.status = { not: 'Closed' };
    }
  }

  if (search && search.trim() !== '') {
    const term = search.trim();
    where.OR = [
      { ticket_id: { contains: term, mode: 'insensitive' } },
      { customer_name: { contains: term, mode: 'insensitive' } },
      { customer_email: { contains: term, mode: 'insensitive' } },
      { subject: { contains: term, mode: 'insensitive' } },
      { description: { contains: term, mode: 'insensitive' } },
      { order_reference: { contains: term, mode: 'insensitive' } },
    ];
  }

  const orderBy = {
    created_at: sort === 'oldest' ? 'asc' : 'desc',
  };

  const skip = (page - 1) * limit;

  const [total, tickets] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: {
          select: { notes: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit) || (total === 0 ? 0 : 1);

  return {
    tickets,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
  };
}

export async function getTicketByTicketId(ticketId) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      ticket_id: ticketId,
    },
    include: {
      notes: {
        orderBy: {
          created_at: 'asc',
        },
      },
    },
  });

  return ticket;
}

export async function updateTicket(ticketId, { status, priority, order_reference, notes }) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.ticket.findUnique({
      where: { ticket_id: ticketId },
    });

    if (!existing) {
      return null;
    }

    const updateData = {};
    if (status !== undefined && status !== null) {
      updateData.status = status;
    }
    if (priority !== undefined && priority !== null) {
      updateData.priority = priority;
    }
    if (order_reference !== undefined) {
      updateData.order_reference = order_reference?.trim() || null;
    }

    let updatedTicket = existing;
    if (Object.keys(updateData).length > 0 || (notes && notes.trim() !== '')) {
      updatedTicket = await tx.ticket.update({
        where: { ticket_id: ticketId },
        data: updateData,
      });
    }

    if (notes && typeof notes === 'string' && notes.trim() !== '') {
      await tx.note.create({
        data: {
          ticket_id: ticketId,
          note_text: notes.trim(),
        },
      });
    }

    return updatedTicket;
  });
}

export async function getDashboardStats() {
  const cutoffDate = new Date(Date.now() - NEEDS_ATTENTION_HOURS * 60 * 60 * 1000);
  const needsAttentionWhere = {
    status: { not: 'Closed' },
    created_at: { lte: cutoffDate },
  };

  const [total, open, inProgress, closed, highPriority, needsAttention, needsAttentionTickets] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: 'Open' } }),
    prisma.ticket.count({ where: { status: 'In Progress' } }),
    prisma.ticket.count({ where: { status: 'Closed' } }),
    prisma.ticket.count({ where: { priority: 'High' } }),
    prisma.ticket.count({ where: needsAttentionWhere }),
    prisma.ticket.findMany({
      where: needsAttentionWhere,
      orderBy: { created_at: 'asc' },
      take: 5,
      select: {
        id: true,
        ticket_id: true,
        customer_name: true,
        customer_email: true,
        subject: true,
        priority: true,
        status: true,
        order_reference: true,
        created_at: true,
      },
    }),
  ]);

  return {
    total,
    open,
    inProgress,
    closed,
    highPriority,
    needsAttention,
    needsAttentionTickets,
  };
}
