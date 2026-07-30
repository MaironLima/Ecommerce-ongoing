import 'dotenv/config';
import Stripe from 'stripe';
import { prisma } from '../src/libs/prisma.ts';

const BASE = 'http://localhost:3000';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const log = (step, msg) => console.log(`\n=== [${step}] ${msg} ===`);

async function main() {
  // ---------- 1) find a variant with stock ----------
  log(1, 'Finding a product variant with stock > 5');
  const variant = await prisma.productVariant.findFirst({
    where: { stock: { gt: 5 } },
    include: { product_sync: { select: { title: true, base_price: true } } },
  });
  if (!variant) throw new Error('No variant with stock > 5 found. Seed a product first.');
  console.log('variant:', variant.id, '| stock:', variant.stock, '| product:', variant.product_sync.title);

  // ---------- 2) register test user ----------
  log(2, 'Registering test user');
  const email = `stripe-test-${Date.now()}@example.com`;
  const password = 'Test1234!';
  const reg = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Stripe Tester', email, password }),
  });
  const regBody = await reg.json().catch(() => ({}));
  console.log('register status:', reg.status, regBody);
  if (!reg.ok && reg.status !== 409) throw new Error(`register failed: ${JSON.stringify(regBody)}`);

  // ---------- 3) login ----------
  log(3, 'Logging in');
  const login = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginBody = await login.json();
  const token = loginBody.accessToken ?? loginBody.token ?? loginBody.access_token;
  if (!token) throw new Error(`no accessToken in login response: ${JSON.stringify(loginBody)}`);
  console.log('got access token (truncated):', String(token).slice(0, 25) + '...');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: token };

  // ---------- 4) add to cart ----------
  log(4, 'Adding 2 units to cart');
  const add = await fetch(`${BASE}/cart`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ variant_id: variant.id, quantity: 2 }),
  });
  const addBody = await add.json().catch(() => ({}));
  console.log('add-to-cart status:', add.status, addBody);
  if (!add.ok) throw new Error(`add to cart failed: ${JSON.stringify(addBody)}`);

  const stockAfterAdd = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  console.log('stock after add (should be -2):', stockAfterAdd.stock);
  const reservations = await prisma.inventoryReservation.findMany({ where: { variant_id: variant.id } });
  console.log('active reservations for variant:', reservations.map(r => ({ qty: r.quantity, cart_item_id: r.cart_item_id })));

  // ---------- 5) create checkout session ----------
  log(5, 'Creating checkout session (order + PaymentIntent)');
  const co = await fetch(`${BASE}/checkout/session`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ currency: 'brl' }),
  });
  const coBody = await co.json();
  console.log('checkout status:', co.status, coBody);
  if (!co.ok) throw new Error(`checkout failed: ${JSON.stringify(coBody)}`);
  const { order_id, client_secret } = coBody;

  const orderPending = await prisma.order.findUnique({ where: { id: order_id }, include: { order_item: true } });
  console.log('order in DB:', { id: orderPending.id, status: orderPending.status, total: String(orderPending.total), items: orderPending.order_item.length });

  // ---------- 6) confirm payment with test card (simulates frontend) ----------
  log(6, 'Confirming PaymentIntent with test card pm_card_visa');
  const piId = client_secret.split('_secret_')[0];
  const confirmed = await stripe.paymentIntents.confirm(piId, { payment_method: 'pm_card_visa' });
  console.log('PaymentIntent status after confirm:', confirmed.status);
  if (confirmed.status !== 'succeeded') throw new Error(`payment did not succeed: ${confirmed.status}`);

  // ---------- 7) wait for webhook ----------
  log(7, 'Waiting for webhook to mark order PAID (stripe listen must be running)');
  let orderPaid = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    orderPaid = await prisma.order.findUnique({ where: { id: order_id } });
    if (orderPaid.status === 'PAID') break;
    process.stdout.write(`  poll ${i + 1}/20: status=${orderPaid.status}\r`);
  }
  console.log('\nfinal order status:', orderPaid.status);
  if (orderPaid.status !== 'PAID') throw new Error('order was NOT marked PAID by webhook');

  // ---------- 8) verify post-conditions ----------
  log(8, 'Verifying post-conditions');
  const cartAfter = await prisma.cart.findFirst({ where: { user_id: orderPending.user_id }, include: { cart_item: true } });
  console.log('cart items after payment (should be 0):', cartAfter?.cart_item?.length ?? 'no cart');
  const reservationsAfter = await prisma.inventoryReservation.findMany({ where: { variant_id: variant.id } });
  console.log('reservations after payment (should be 0):', reservationsAfter.length);
  const stockFinal = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  console.log('stock final (should equal stock after add):', stockFinal.stock);

  // ---------- 9) check API status endpoint ----------
  log(9, 'Checking GET /checkout/:orderId/status and GET /orders');
  const st = await fetch(`${BASE}/checkout/${order_id}/status`, { headers: authHeaders });
  console.log('status endpoint:', st.status, await st.json());
  const od = await fetch(`${BASE}/orders`, { headers: authHeaders });
  const odBody = await od.json();
  console.log('orders endpoint:', od.status, '| count:', odBody.length, '| first:', odBody[0] && { id: odBody[0].id, status: odBody[0].status, total: odBody[0].total });

  log('DONE', 'END-TO-END TEST PASSED');
}

main()
  .catch((e) => { console.error('\n!!! TEST FAILED:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect() && process.exit(0));
