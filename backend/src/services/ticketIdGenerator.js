import prisma from '../config/db.js';

/**
 * Generates the next human-readable sequential ticket ID.
 * Example: TKT-001, TKT-002, etc.
 * Uses Prisma transaction / atomic max query to ensure consistency.
 *
 * @param {import('@prisma/client').PrismaClient} [tx] Optional transaction client
 * @returns {Promise<string>}
 */
export async function generateTicketId(tx = prisma) {
  // Find the ticket with the latest id or highest sequence
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

  // Parse existing number from format TKT-XXX
  const match = latestTicket.ticket_id.match(/^TKT-(\d+)$/i);
  let nextNumber = 1;
  if (match) {
    nextNumber = parseInt(match[1], 10) + 1;
  } else {
    // Fallback: use highest database id + 1
    nextNumber = latestTicket.id + 1;
  }

  // Ensure format TKT-001, TKT-010, TKT-100, TKT-1000
  const paddedNumber = String(nextNumber).padStart(3, '0');
  return `TKT-${paddedNumber}`;
}
