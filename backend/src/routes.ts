import { Router } from 'express';
import Container from 'typedi';
import express, { Express } from 'express';
import { CakeController } from './controllers/cakeController';
import * as path from 'path';
import { ConfigService } from './services/core/configService';
import { Controller } from './controllers/controller';

export const configureRoutes = (app: Express) => {
  const configService = Container.get(ConfigService);
  const config = configService.getAppConfig();
  app.use(
    `/${config.storage.directory}`,
    express.static(path.join(process.cwd(), config.storage.directory)),
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

  router.get('/cakes', Controller.asyncRequestHandler(cakeController.findMany));
  router.delete('/cakes/:id', Controller.asyncRequestHandler(cakeController.deleteOne));

  app.use(router);

  app.use(Controller.globalErrorHandler);
};
