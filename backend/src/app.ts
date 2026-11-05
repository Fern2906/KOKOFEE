import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { corsOrigins, env } from './config/env';
import apiRoutes from './routes';
import { errorHandler, notFound } from './middleware/error-handler';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  app.get('/', (_req, res) => {
    res.json({
      name: 'KOKOFEE API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        products: '/api/products',
        recipes: '/api/recipes',
      },
    });
  });

  app.use('/api', apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
