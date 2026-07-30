import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config/env.js';

if (!STRIPE_SECRET_KEY) {
  console.warn('[stripe] STRIPE_SECRET_KEY is not set; payment endpoints will fail until configured.');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
});