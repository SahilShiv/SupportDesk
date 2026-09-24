process.env.NODE_ENV = 'test';

import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';
import prisma from '../src/config/db.js';

let server;
let baseUrl;

test.before(async () => {
  // Start server on an ephemeral port for testing
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await prisma.$disconnect();
});

test('TEST 20: GET /api/health returns ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.service, 'SupportDesk API');
});

test('TEST 1: POST /api/tickets creates ticket and returns ID', async () => {
  const res = await fetch(`${baseUrl}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      subject: 'Test issue subject',
      description: 'Test description of the customer problem',
      priority: 'High',
    }),
  });

  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.match(body.data.ticket_id, /^TKT-\d{3,}$/);
  assert.ok(body.data.created_at);
  assert.equal(body.data.status, 'Open');
  assert.equal(body.data.priority, 'High');
});

test('TEST 2: POST /api/tickets returns 400 for invalid data', async () => {
  const res = await fetch(`${baseUrl}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: '',
      customer_email: 'not-an-email',
      subject: '',
      description: '',
    }),
  });

  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.ok(body.message.length > 0);
});

test('TEST 3: GET /api/tickets returns list of tickets with pagination', async () => {
  const res = await fetch(`${baseUrl}/tickets?page=1&limit=5`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.equal(body.data.length, 5);
  assert.ok(body.pagination.total >= 14);
  assert.equal(body.pagination.page, 1);
  assert.equal(body.pagination.limit, 5);
});

test('TEST 4: GET /api/tickets?search=Rahul finds matching customer', async () => {
  const res = await fetch(`${baseUrl}/tickets?search=Rahul`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.some((t) => t.customer_name.toLowerCase().includes('rahul')));
});

test('TEST 5: GET /api/tickets?search=gulfconsult.ae finds matching email', async () => {
  const res = await fetch(`${baseUrl}/tickets?search=gulfconsult.ae`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.some((t) => t.customer_email.includes('gulfconsult.ae')));
});

test('TEST 6: GET /api/tickets?search=TKT-001 finds matching ticket ID', async () => {
  const res = await fetch(`${baseUrl}/tickets?search=TKT-001`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.equal(body.data[0].ticket_id, 'TKT-001');
});

test('TEST 7: GET /api/tickets?search=ceramic finds matching description', async () => {
  const res = await fetch(`${baseUrl}/tickets?search=ceramic`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data[0].description.toLowerCase().includes('ceramic'));
});

test('TEST 8: GET /api/tickets?status=Open returns only Open tickets', async () => {
  const res = await fetch(`${baseUrl}/tickets?status=Open`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((t) => t.status === 'Open'));
});

test('TEST 9: GET /api/tickets?status=In Progress returns only In Progress tickets', async () => {
  const res = await fetch(`${baseUrl}/tickets?status=In%20Progress`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((t) => t.status === 'In Progress'));
});

test('TEST 10: GET /api/tickets?status=Closed returns only Closed tickets', async () => {
  const res = await fetch(`${baseUrl}/tickets?status=Closed`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((t) => t.status === 'Closed'));
});

test('TEST 11: GET /api/tickets?priority=High returns only High priority tickets', async () => {
  const res = await fetch(`${baseUrl}/tickets?priority=High`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((t) => t.priority === 'High'));
});

test('TEST 12: GET /api/tickets/TKT-001 returns correct details with notes', async () => {
  const res = await fetch(`${baseUrl}/tickets/TKT-001`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.data.ticket_id, 'TKT-001');
  assert.equal(body.data.customer_name, 'Rahul Sharma');
  assert.ok(Array.isArray(body.data.notes));
  assert.ok(body.data.notes.length >= 2);
});

test('TEST 13 & 14: PUT /api/tickets/:id updates status and priority', async () => {
  const res = await fetch(`${baseUrl}/tickets/TKT-003`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'In Progress',
      priority: 'Medium',
    }),
  });

  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.updated_at);

  // Verify in DB via GET
  const verifyRes = await fetch(`${baseUrl}/tickets/TKT-003`);
  const verifyBody = await verifyRes.json();
  assert.equal(verifyBody.data.status, 'In Progress');
  assert.equal(verifyBody.data.priority, 'Medium');
});

test('TEST 15 & 16: PUT /api/tickets/:id appends notes without deleting previous', async () => {
  // First note
  const res1 = await fetch(`${baseUrl}/tickets/TKT-003`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notes: 'First test note added via API',
    }),
  });
  assert.equal(res1.status, 200);

  // Second note
  const res2 = await fetch(`${baseUrl}/tickets/TKT-003`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      notes: 'Second test note added via API',
    }),
  });
  assert.equal(res2.status, 200);

  // Verify notes list contains both notes
  const verifyRes = await fetch(`${baseUrl}/tickets/TKT-003`);
  const verifyBody = await verifyRes.json();
  const noteTexts = verifyBody.data.notes.map((n) => n.note_text);
  assert.ok(noteTexts.includes('First test note added via API'));
  assert.ok(noteTexts.includes('Second test note added via API'));
});

test('TEST 17: PUT /api/tickets/:id updates status and adds note together', async () => {
  const res = await fetch(`${baseUrl}/tickets/TKT-003`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'Closed',
      notes: 'Issue resolved after verification',
    }),
  });

  assert.equal(res.status, 200);

  const verifyRes = await fetch(`${baseUrl}/tickets/TKT-003`);
  const verifyBody = await verifyRes.json();
  assert.equal(verifyBody.data.status, 'Closed');
  assert.ok(verifyBody.data.notes.some((n) => n.note_text === 'Issue resolved after verification'));
});

test('TEST 18: GET /api/dashboard/stats returns dynamic database metrics', async () => {
  const res = await fetch(`${baseUrl}/dashboard/stats`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);

  const dbTotal = await prisma.ticket.count();
  const dbOpen = await prisma.ticket.count({ where: { status: 'Open' } });
  const dbInProgress = await prisma.ticket.count({ where: { status: 'In Progress' } });
  const dbClosed = await prisma.ticket.count({ where: { status: 'Closed' } });
  const dbHigh = await prisma.ticket.count({ where: { priority: 'High' } });

  assert.equal(body.data.total, dbTotal);
  assert.equal(body.data.open, dbOpen);
  assert.equal(body.data.inProgress, dbInProgress);
  assert.equal(body.data.closed, dbClosed);
  assert.equal(body.data.highPriority, dbHigh);
});

test('TEST 19: GET /api/tickets/TKT-9999 returns 404 for non-existent ticket', async () => {
  const res = await fetch(`${baseUrl}/tickets/TKT-9999`);
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.success, false);
  assert.equal(body.message, 'Ticket not found');
});

test('TEST 21: GET /api/dashboard/stats returns needsAttention count and tickets', async () => {
  const res = await fetch(`${baseUrl}/dashboard/stats`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(typeof body.data.needsAttention === 'number');
  assert.ok(Array.isArray(body.data.needsAttentionTickets));
  assert.ok(body.data.needsAttentionTickets.every((t) => t.status !== 'Closed'));
});

test('TEST 22: GET /api/tickets?needsAttention=true returns unresolved tickets older than 24h', async () => {
  const res = await fetch(`${baseUrl}/tickets?needsAttention=true`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.ok(body.data.every((t) => t.status !== 'Closed'));
});

test('TEST 23: GET /api/tickets?search=ORD-2026-10482 finds ticket by order reference', async () => {
  const res = await fetch(`${baseUrl}/tickets?search=ORD-2026-10482`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.ok(body.data.length > 0);
  assert.equal(body.data[0].order_reference, 'ORD-2026-10482');
});


