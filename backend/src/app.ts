import 'reflect-metadata';
import express from 'express';
import { configureRoutes } from './routes';
import { initializeDatabase } from './dataSource';
import { initDotenv } from './env';
initDotenv();

export const initApp = async () => {
  const app = express();

  //use express.json() to parse incoming requests with JSON payloads
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); //parse incoming requests with urlencoded payloads

  await initializeDatabase();

  configureRoutes(app);

  return app;
};
