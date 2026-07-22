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
import productsRoutes from './modules/catalog/products/routes.js';
import { variantsRoutes } from './modules/catalog/variants/routes.js';
import path from 'path';
import fs from 'fs';
import cartRoutes from './modules/cart/routes.js';
import { startCronJobs } from './jobs/cron.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
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
    referrerPolicy: { policy: 'no-referrer' },
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

  // 1. Pega apenas o nome do arquivo (ex: "blue.webp")
  const fileName = path.basename(decodeURIComponent(fileSource));

  // 2. Monta o caminho apontando corretamente para dentro de "back-end/imagens/uploads"
  const absolutePath = path.resolve(process.cwd(), 'imagens', 'uploads', fileName);

  // 3. Verifica se o arquivo existe na pasta física real
  if (!fs.existsSync(absolutePath)) {
    console.error(`[ERRO NO DISCO] Não achou em: ${absolutePath}`);
    return res.status(404).json({ error: 'File not found' });
  }

  // 4. Envia o arquivo para o Frontend
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
app.use('/variants', variantsRoutes);
app.use('/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
  startCronJobs();
  console.log("[cron] Cron jobs iniciados");
});