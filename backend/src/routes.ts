import { Router } from 'express';
import Container from 'typedi';
import express, { Express } from 'express';
import { CakeController } from './controllers/cakeController';
import * as path from 'path';
import { ConfigService } from './services/core/configService';
import { Controller } from './controllers/controller';

export const configureRoutes = (app: Express) => {
  const configService = Container.get(ConfigService);
  app.use(
    '/storage',
    express.static(path.join(process.cwd(), configService.getAppConfig().storage.directory)),
  );

  const router = Router();

  const cakeController = Container.get(CakeController);

  router.get('/', async (req, res) => {
    return res.status(200).json({ message: 'Hello World' });
  });

  router.post(
    '/cakes',
    cakeController.uploadImagesMiddleware,
    Controller.asyncRequestHandler(cakeController.createOne),
  );

  router.put(
    '/cakes/:id',
    cakeController.uploadImagesMiddleware,
    Controller.asyncRequestHandler(cakeController.updateOne),
  );

  router.get('/cakes', cakeController.findMany);

  app.use(router);

  // ✅ THEN error handler LAST
  app.use(Controller.globalErrorHandler);
};
