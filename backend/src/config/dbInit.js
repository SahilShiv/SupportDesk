import prisma from './db.js';

const initialTickets = [
  {
    ticket_id: 'TKT-001',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@gmail.com',
    subject: 'UPI payment failed',
    description: 'Customer completed the UPI payment via PhonePe, but the order status still shows payment pending and no confirmation SMS was received.',
    status: 'In Progress',
    priority: 'High',
    order_reference: 'ORD-2026-92834',
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Customer provided UPI reference ID 49201948201. Reached out to payment gateway operations team.',
        created_at: new Date(Date.now() - 30 * 60 * 60 * 1000),
      },
      {
        note_text: 'Gateway team confirmed settlement. Syncing transaction status with order service.',
        created_at: new Date(Date.now() - 20 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-002',
    customer_name: 'Priya Nair',
    customer_email: 'priya.nair@outlook.com',
    subject: 'Refund not received',
    description: 'Customer reports that the ceramic cookware set order was cancelled three days ago but the refund has not yet appeared in the account.',
    status: 'Open',
    priority: 'High',
    order_reference: 'ORD-2026-10482',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Bank refund ARN generated. Re-confirming processing window with merchant acquiring bank.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-003',
    customer_name: 'Rohan Patil',
    customer_email: 'rohan.patil@techcorp.in',
    subject: 'Account login issue',
    description: 'Customer is unable to log in via corporate SSO portal. Error code 500 received after OTP verification step.',
    status: 'Open',
    priority: 'High',
    order_reference: null,
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-004',
    customer_name: 'Sneha Kulkarni',
    customer_email: 'sneha.kulkarni@gmail.com',
    subject: 'Order delivery delayed',
    description: 'Shipment tracking shows package arrived at Pune Hub 48 hours ago without further courier movement.',
    status: 'In Progress',
    priority: 'Medium',
    order_reference: 'ORD-2026-88129',
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Escalated to BlueDart logistics hub operations for priority dispatch.',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-005',
    customer_name: 'Ananya Deshmukh',
    customer_email: 'ananya.d@gmail.com',
    subject: 'Damaged item received',
    description: 'Glass dinner set arrived with two bowls shattered. Customer provided images of outer carton and damaged pieces.',
    status: 'Open',
    priority: 'High',
    order_reference: 'ORD-2026-44910',
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-006',
    customer_name: 'Vikram Joshi',
    customer_email: 'vikram.joshi@finance.in',
    subject: 'GST invoice request',
    description: 'Needs B2B tax invoice with Maharashtra GSTIN 27AABCT3518Q1ZV for corporate purchase.',
    status: 'Open',
    priority: 'Medium',
    order_reference: 'ORD-2026-30219',
    created_at: new Date(Date.now() - 32 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-007',
    customer_name: 'Aditi Rao',
    customer_email: 'aditi.rao@yahoo.com',
    subject: 'Product size exchange',
    description: 'Received size Medium linen shirt; customer requests replacement in size Large. Original tags and polybag intact.',
    status: 'In Progress',
    priority: 'Low',
    order_reference: 'ORD-2026-55912',
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Reverse pickup booked for tomorrow afternoon.',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-008',
    customer_name: 'Suresh Menon',
    customer_email: 'suresh.menon@keralatraders.com',
    subject: 'Address change for pending shipment',
    description: 'Wants to change delivery address from Kochi warehouse to Ernakulam office branch before dispatch.',
    status: 'Open',
    priority: 'High',
    order_reference: 'ORD-2026-78321',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-009',
    customer_name: 'Kavita Iyer',
    customer_email: 'kavita.iyer@gmail.com',
    subject: 'Coupon code not applying',
    description: 'Promotional discount FESTIVE20 is showing invalid error during checkout on cart value ₹2,400.',
    status: 'In Progress',
    priority: 'Low',
    order_reference: null,
    created_at: new Date(Date.now() - 14 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-010',
    customer_name: 'Amitabh Sen',
    customer_email: 'amitabh.sen@bengalcorp.in',
    subject: 'Wrong product received',
    description: 'Ordered 65W GaN laptop charger but received standard 20W mobile adapter in the parcel.',
    status: 'Open',
    priority: 'High',
    order_reference: 'ORD-2026-61840',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-011',
    customer_name: 'Pooja Hegde',
    customer_email: 'pooja.hegde@blrtech.com',
    subject: 'Subscription renewal enquiry',
    description: 'Annual enterprise support contract expires next week; requesting updated quote with multi-year tier.',
    status: 'Closed',
    priority: 'Medium',
    order_reference: null,
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Sent customized commercial proposal via email.',
        created_at: new Date(Date.now() - 50 * 60 * 60 * 1000),
      },
      {
        note_text: 'Renewal PO received and processed. Account activated for 2 years.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-012',
    customer_name: 'Manish Gupta',
    customer_email: 'manish.gupta@delhicap.in',
    subject: 'Netbanking session timeout',
    description: 'SBI net banking portal logged out during checkout, amount debited but order not created in account.',
    status: 'Closed',
    priority: 'High',
    order_reference: 'ORD-2026-90112',
    created_at: new Date(Date.now() - 96 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Reconciliation verified with SBI PG. Payment captured and order generated manually.',
        created_at: new Date(Date.now() - 80 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-013',
    customer_name: 'Deepak Chawla',
    customer_email: 'deepak.c@chawlaexports.com',
    subject: 'Export documentation inquiry',
    description: 'Requires electronic shipping bill and bank realization certificate for foreign currency remittance.',
    status: 'Closed',
    priority: 'Low',
    order_reference: null,
    created_at: new Date(Date.now() - 120 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Documentation forwarded to customer finance desk.',
        created_at: new Date(Date.now() - 90 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-014',
    customer_name: 'Tanya Roy',
    customer_email: 'tanya.roy@kolkatamedia.org',
    subject: 'Newsletter unsubscribe',
    description: 'Customer clicked unsubscribe link in promotional emails but continues to receive weekly marketing digests.',
    status: 'Closed',
    priority: 'Low',
    order_reference: null,
    created_at: new Date(Date.now() - 85 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Manually removed email address from marketing distribution list.',
        created_at: new Date(Date.now() - 60 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-015',
    customer_name: 'Naveen Reddy',
    customer_email: 'naveen.reddy@hyderabadpharma.in',
    subject: 'Bulk order discount inquiry',
    description: 'Inquiring about corporate bulk procurement pricing for 250 units of air purifiers with GST invoice.',
    status: 'In Progress',
    priority: 'Medium',
    order_reference: null,
    created_at: new Date(Date.now() - 34 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Forwarded inquiry to South Zone enterprise sales manager.',
        created_at: new Date(Date.now() - 18 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-016',
    customer_name: 'Ishita Verma',
    customer_email: 'ishita.verma@quickpay.in',
    subject: 'Wallet balance not updated',
    description: 'Transferred ₹1,500 via IMPS to wallet balance; amount debited from HDFC account but in-app balance remains unchanged.',
    status: 'Open',
    priority: 'High',
    order_reference: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    notes: [],
  },
];

let initPromise = null;

export async function ensureDatabaseReady() {
  if (!process.env.DATABASE_URL) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "tickets" (
          "id" SERIAL PRIMARY KEY,
          "ticket_id" TEXT NOT NULL UNIQUE,
          "customer_name" TEXT NOT NULL,
          "customer_email" TEXT NOT NULL,
          "subject" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'Open',
          "priority" TEXT NOT NULL DEFAULT 'Medium',
          "order_reference" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "notes" (
          "id" SERIAL PRIMARY KEY,
          "ticket_id" TEXT NOT NULL,
          "note_text" TEXT NOT NULL,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "notes_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("ticket_id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);

      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "tickets_status_idx" ON "tickets"("status");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "tickets_priority_idx" ON "tickets"("priority");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "tickets_customer_email_idx" ON "tickets"("customer_email");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "tickets_order_reference_idx" ON "tickets"("order_reference");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "tickets_created_at_idx" ON "tickets"("created_at");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "notes_ticket_id_idx" ON "notes"("ticket_id");`);
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "notes_created_at_idx" ON "notes"("created_at");`);

      const count = await prisma.ticket.count();
      if (count === 0) {
        for (const item of initialTickets) {
          const { notes, ...ticketData } = item;
          await prisma.ticket.create({
            data: {
              ...ticketData,
              notes: {
                create: notes,
              },
            },
          });
        }
      }
    } catch (err) {
      console.warn('[Database Auto-Init Warning]:', err.message);
    }
  })();

  return initPromise;
}
