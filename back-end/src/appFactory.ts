import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { requestLogger } from './common/utils/logmiddleware.js';
import pingRoutes from './modules/health/routes.js';
import userRoutes from './modules/auth/routes.js';
import productsRoutes from './modules/catalog/products/routes.js';
import categoryRoutes from './modules/catalog/category/routes.js';
import { variantsRoutes } from './modules/catalog/variants/routes.js';
import cartRoutes from './modules/cart/routes.js';
import checkoutRoutes from './modules/checkout/routes.js';
import ordersRoutes from './modules/orders/routes.js';
import stripeWebhookRoutes from './modules/webhooks/stripe/routes.js';
import reviewRoutes from './modules/reviews/routes.js';

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );

  app.use(
    '/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    stripeWebhookRoutes,
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('combined'));
  app.use(requestLogger);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      hidePoweredBy: true,
      frameguard: { action: 'deny' },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.get('/uploads', (req, res) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const fileSource = req.query.path as string;

    if (!fileSource) {
      return res.status(400).json({ error: 'Parameter "path" is required' });
    }

    const fileName = path.basename(decodeURIComponent(fileSource));
    const absolutePath = path.resolve(process.cwd(), 'imagens', 'uploads', fileName);

    if (!fs.existsSync(absolutePath)) {
      console.error(`[ERRO NO DISCO] Não achou em: ${absolutePath}`);
      return res.status(404).json({ error: 'File not found' });
    }

    res.sendFile(absolutePath);
  });

  app.use(
    '/auth/login',
    rateLimit({
      windowMs: 60 * 1000,
      max: 5,
      message: 'Too many requests. Wait a minute.',
    }),
  );

  app.use(
    '/auth/register',
    rateLimit({
      windowMs: 60 * 1000,
      max: 5,
      message: 'Too many requests. Wait a minute.',
    }),
  );

  app.use(
    '/auth/recover-email',
    rateLimit({
      windowMs: 60 * 1000,
      max: 3,
      message: 'Wait a minute to a new request.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use('/ping', pingRoutes);
  app.use('/auth', userRoutes);
  app.use('/products', productsRoutes);
  app.use('/product', reviewRoutes);
  app.use('/catalog/category', categoryRoutes);
  app.use('/variants', variantsRoutes);
  app.use('/cart', cartRoutes);
  app.use('/checkout', checkoutRoutes);
  app.use('/orders', ordersRoutes);

  return app;
}