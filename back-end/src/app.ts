import express from 'express';
import { PORT } from './config/env.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pingRoutes from './modules/health/routes.js';
import morgan from 'morgan';
import { requestLogger } from './common/utils/logmiddleware.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRoutes from './modules/auth/routes.js';
import productsRoutes from './modules/cart/products/routes.js';
import productsVariantRoutes from './modules/cart/variants/routes.js';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
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
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
  }),
);




app.use(
  '/auth/recover-email',
  rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: 'Wait a minute to a new request.',
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(
  "/auth/login",
  rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "Too many requests. Wait a minute.",
  })
);

app.use('/ping', pingRoutes);
app.use('/auth', userRoutes);
app.use('/products', productsRoutes); // + review
// app.use('/cart', cartRoutes);
// app.use('/checkout', checkoutRoutes);
// app.use('/orders', ordersRoutes);
// app.use('/admin', requireRole(["ADMIN"]), adminRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
