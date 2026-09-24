import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleTickets = [
  {
    ticket_id: 'TKT-001',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@gmail.com',
    subject: 'UPI payment failed',
    description: 'Customer completed the UPI payment via PhonePe, but the order status still shows payment pending and no confirmation SMS was received.',
    status: 'In Progress',
    priority: 'High',
    order_reference: 'ORD-2026-92834',
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago (1d old)
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
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago (2d old)
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
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000), // 28 hours ago (1d old)
    notes: [],
  },
  {
    ticket_id: 'TKT-004',
    customer_name: 'Sneha Kulkarni',
    customer_email: 'sneha.kulkarni@gmail.com',
    subject: 'Order delivery delayed',
    description: 'Order was scheduled for delivery on Monday. Tracking indicates package has been delayed at the regional distribution center.',
    status: 'In Progress',
    priority: 'Medium',
    order_reference: 'ORD-2026-88412',
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago (26h old)
    notes: [
      {
        note_text: 'Escalated to BlueDart logistics hub lead for priority dispatch.',
        created_at: new Date(Date.now() - 14 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-005',
    customer_name: 'Aditya Deshmukh',
    customer_email: 'aditya.deshmukh@venture.co.in',
    subject: 'Wrong item received',
    description: 'Received mechanical wireless keyboard with blue tactile switches instead of red linear switches ordered in invoice.',
    status: 'Open',
    priority: 'Medium',
    order_reference: 'ORD-2026-49102',
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    notes: [],
  },
  {
    ticket_id: 'TKT-006',
    customer_name: 'Neha Joshi',
    customer_email: 'neha.joshi@gmail.com',
    subject: 'GST invoice request',
    description: 'Our accounts department requires a revised B2B tax invoice with our company GSTIN number 27AAAAA0000A1Z5 included on header.',
    status: 'In Progress',
    priority: 'Low',
    order_reference: 'ORD-2026-98212',
    created_at: new Date(Date.now() - 32 * 60 * 60 * 1000), // 32 hours ago (1d old)
    notes: [
      {
        note_text: 'Verified company GST certificate on GST portal. Forwarded to billing desk.',
        created_at: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-007',
    customer_name: 'Rahul Mehta',
    customer_email: 'rahul.mehta@designstudio.in',
    subject: 'Subscription payment failed',
    description: 'Auto-debit for monthly Pro workspace subscription failed with bank error code E-MANDATE_FAIL.',
    status: 'Closed',
    priority: 'Medium',
    order_reference: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Shared manual UPI payment link. Customer successfully renewed subscription.',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-008',
    customer_name: 'Pooja Iyer',
    customer_email: 'pooja.iyer@gulfconsult.ae',
    subject: 'Password reset email not received',
    description: 'Requested password reset 3 times over the last hour. Checked spam and promotions folders, but no reset email arrives.',
    status: 'Open',
    priority: 'High',
    order_reference: null,
    created_at: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    notes: [],
  },
  {
    ticket_id: 'TKT-009',
    customer_name: 'Akash Shah',
    customer_email: 'akash.shah@gmail.com',
    subject: 'COD order cancellation',
    description: 'Customer requests cancellation of COD shipment as they will be traveling out of town during delivery window.',
    status: 'Closed',
    priority: 'Low',
    order_reference: 'ORD-2026-77129',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Cancelled shipment in courier dispatch portal prior to out-for-delivery scan.',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-010',
    customer_name: 'Sakshi More',
    customer_email: 'sakshi.more@enterprise.in',
    subject: 'Address update request',
    description: 'Customer entered old flat number during checkout. Needs delivery address updated to Flat 402, Green Meadows, Pune.',
    status: 'In Progress',
    priority: 'Medium',
    order_reference: 'ORD-2026-61920',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'Address updated with logistics partner system.',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-011',
    customer_name: 'Vikram Rao',
    customer_email: 'vikram.rao@fintech.co.in',
    subject: 'Order status not updated',
    description: 'Delivery associate handed over parcel at security gate yesterday, but app still reflects status as In Transit.',
    status: 'Closed',
    priority: 'Low',
    order_reference: 'ORD-2026-55102',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    notes: [
      {
        note_text: 'POD signature verified with delivery driver. Marked delivered in system.',
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-012',
    customer_name: 'Ananya Gupta',
    customer_email: 'ananya.gupta@bluetech.in',
    subject: 'Promo code not working',
    description: 'Festive coupon code SAVE20 indicates invalid discount error at checkout despite cart value exceeding minimum ₹2,000 threshold.',
    status: 'Open',
    priority: 'Medium',
    order_reference: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-013',
    customer_name: 'Kunal Shah',
    customer_email: 'kunal.shah@retailhub.in',
    subject: 'Damaged product received',
    description: 'External courier box had puncture marks and internal tempered glass screen protector was cracked on arrival.',
    status: 'In Progress',
    priority: 'High',
    order_reference: 'ORD-2026-44192',
    created_at: new Date(Date.now() - 34 * 60 * 60 * 1000), // 34 hours ago (1d old)
    notes: [
      {
        note_text: 'Damage images verified by QC team. Replacement unit queued for dispatch.',
        created_at: new Date(Date.now() - 16 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticket_id: 'TKT-014',
    customer_name: 'Shreya Deshpande',
    customer_email: 'shreya.d@gmail.com',
    subject: 'Delivery partner issue',
    description: 'Delivery driver marked customer unavailable without dialing phone or ringing the doorbell.',
    status: 'Open',
    priority: 'Medium',
    order_reference: 'ORD-2026-38104',
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000),
    notes: [],
  },
  {
    ticket_id: 'TKT-015',
    customer_name: 'Omkar Patil',
    customer_email: 'omkar.patil@logistics.in',
    subject: 'Duplicate payment deducted',
    description: 'Bank statement reflects two consecutive deductions of ₹2,499 for single order. Requesting reversal of excess debit.',
    status: 'In Progress',
    priority: 'High',
    order_reference: 'ORD-2026-66182',
    created_at: new Date(Date.now() - 40 * 60 * 60 * 1000), // 40 hours ago (1d old)
    notes: [
      {
        note_text: 'Duplicate transaction reference checked on merchant gateway. Initiated refund for secondary charge.',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
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

async function main() {
  console.log('Seeding SupportDesk database with Indian-centric demo data and order references...');

  // Clear existing notes and tickets to ensure clean idempotent seed
  await prisma.note.deleteMany();
  await prisma.ticket.deleteMany();

  for (const item of sampleTickets) {
    const { notes, ...ticketData } = item;
    const ticket = await prisma.ticket.create({
      data: {
        ...ticketData,
        notes: {
          create: notes,
        },
      },
    });
    console.log(`Created ticket: ${ticket.ticket_id} - ${ticket.subject} (Order: ${ticket.order_reference || 'N/A'})`);
  }

  console.log(`Successfully seeded ${sampleTickets.length} Indian-centric tickets with activity notes.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
