import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config.js';
import products from './routes/products.js';
import enquiries from './routes/enquiries.js';
import admin from './routes/admin.js';
import { errorHandler, notFound } from './middleware/errors.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json({ limit: '50kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  app.get('/api/health', (req, res) =>
    res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
  );
  app.use('/api/products', products);
  app.use('/api/enquiries', enquiries);
  app.use('/api/admin', admin);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
