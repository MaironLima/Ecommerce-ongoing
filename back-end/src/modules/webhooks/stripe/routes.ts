import { Router } from 'express';
import { stripeWebhookController } from './controllers.js';

const stripeWebhookRoutes: Router = Router();

stripeWebhookRoutes.post('/', stripeWebhookController);

export default stripeWebhookRoutes;