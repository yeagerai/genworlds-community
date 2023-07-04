import * as Sentry from '@sentry/node';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan, { StreamOptions } from 'morgan';

import { config } from '@app/config';
import { AppLogger, logger } from '@app/infra/logger';

import { errorHandler } from './errorHandler';
import { createRoutes } from './routes';

export const createApp = (): Express => {
  const expressApp: Express = express();

  // =======================================================================
  // Middlewares
  // =======================================================================

  const sentryDSN = config.sentry.dsn;

  if (config.env !== 'test' && sentryDSN) {
    Sentry.init({
      environment: config.env,
      dsn: sentryDSN,
    });
    expressApp.use(Sentry.Handlers.requestHandler());
  }

  // https://expressjs.com/en/advanced/best-practice-security.html
  // --
  // Helmet is actually just a collection of smaller middleware functions
  //  that set security-related HTTP response headers
  expressApp.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // Cross-origin resource sharing
  const corsOrigin = config.server.cors.origin;

  expressApp.use(cors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
    preflightContinue: false,
    maxAge: 1728000,
    credentials: true,
  }));

  // Backend sitting on top of HTTP Proxy
  expressApp.set('trust proxy', 1);

  // To support clients that only support GET and POST
  expressApp.use(methodOverride('X-HTTP-Method-Override'));

  // Compresses response bodies of each request
  expressApp.use(compression());

  // =======================================================================
  // Routes
  // =======================================================================

  /* istanbul ignore next */
  if (config.server.logs.showAccess) {
    logger.debug('> Access logs enabled');
    const loggerAdapter = {
      toStream(_logger: AppLogger): StreamOptions {
        return {
          write(message: string): void {
            _logger.info(message.slice(0, -1));
          },
        };
      },
    };
    expressApp.use(morgan('dev', {
      stream: loggerAdapter.toStream(logger),
    }));
  }

  expressApp.use(createRoutes());

  // =======================================================================
  // Error handlers
  // =======================================================================

  if (config.env !== 'test' && sentryDSN) {
    expressApp.use(Sentry.Handlers.errorHandler());
  }

  expressApp.use(errorHandler);

  logger.debug('Application initialized');

  return expressApp;
};
