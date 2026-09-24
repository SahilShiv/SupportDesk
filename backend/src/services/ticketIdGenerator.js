import prisma from '../config/db.js';

export async function generateTicketId(tx = prisma) {
  const latestTicket = await tx.ticket.findFirst({
    orderBy: {
      id: 'desc',
    },
    select: {
      ticket_id: true,
      id: true,
    },
  });

  if (!latestTicket || !latestTicket.ticket_id) {
    return 'TKT-001';
  }

  const match = latestTicket.ticket_id.match(/^TKT-(\d+)$/i);
  let nextNumber = 1;
  if (match) {
    nextNumber = parseInt(match[1], 10) + 1;
  } else {
    nextNumber = latestTicket.id + 1;
  }

  const paddedNumber = String(nextNumber).padStart(3, '0');
  return `TKT-${paddedNumber}`;
}
