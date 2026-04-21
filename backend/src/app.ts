import 'reflect-metadata';
import express from 'express';
import { configureRoutes } from './routes';
import { initializeDatabase } from './dataSource';
import { initDotenv } from './env';
import cors from 'cors';
initDotenv();

export const initApp = async () => {
  const app = express();

  app.use(
    cors({
      /**
       * @TODO - restrict. Create an enviroment variable for whitelisted domains.
       */
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  await initializeDatabase();

  configureRoutes(app);

  return app;
};
