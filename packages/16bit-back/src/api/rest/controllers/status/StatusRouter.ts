import { Router } from 'express';

import { getStatus } from './endpoints/getStatus';
import { getExtraStatus } from './endpoints/getExtraStatus';

export class StatusRouter {
  public static create(): Router {
    const routes = Router();
    routes.get('/status', getStatus());
    routes.get('/status/extra', getExtraStatus());

    return routes;
  }
}
