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

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use(requestLogger);
app.use(
  helmet({
    contentSecurityPolicy: false, // desativa quando usa React/Vite
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
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many requests.',
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// app.use(
//   "/auth/login",
//   rateLimit({
//     windowMs: 60 * 1000,
//     max: 5,
//     message: "Muitas tentativas. Aguarde 1 minuto.",
//   })
// );

app.use('/ping', pingRoutes);
app.use('/auth', userRoutes);
// app.use('/products', productsRoutes); // + review
// app.use('/cart', cartRoutes);
// app.use('/checkout', checkoutRoutes);
// app.use('/orders', ordersRoutes);
// app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
