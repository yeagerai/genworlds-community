import { monitor } from '@colyseus/monitor';
import { Router } from 'express';
import { json } from 'body-parser';

import { StatusRouter } from './controllers/status/StatusRouter';

export interface ControllerRoutes {
  adminRoutes: Router;
  clientRoutes: Router;
  publicRoutes: Router;
  webhookRoutes: Router;
}

export const createRoutes = (): Router => {
  const statusRouter = StatusRouter.create();

  // Webhooks Routes
  const whRouter = Router();
  // whRouter.use('/webhooks/', []);

  // API Routes
  const apiRouter = Router();
  apiRouter.use(json({ limit: '100kb' }));

  apiRouter.use('/api', [
    statusRouter,
  ]);

  // UI Routes
  const uiRouter = Router();
  uiRouter.use(json({ limit: '100kb' }));

  uiRouter.use('/ui/colyseus/monitor', monitor());

  // Main Router
  const mainRouter = Router();
  mainRouter.use(whRouter);
  mainRouter.use(apiRouter);
  mainRouter.use(uiRouter);

  return mainRouter;
};
