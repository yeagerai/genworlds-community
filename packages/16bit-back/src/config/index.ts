export interface AppConfig {
  env: 'production' | 'staging' | 'development' | 'test' ;
  logging: {
    level: string;
  };
  server: {
    port: number;
    host: string;
    logs: {
      showAccess: boolean;
      showErrors: boolean;
      showStack: boolean;
    };
    cors: {
      origin: string | string[];
    };
  };
  auth: {
    secretKey: string;
  };
  mongodb: {
    host: string;
    port: number;
    user?: string;
    password?: string;
  };
  redis: {
    host: string;
    port: number;
    prefix?: string;
  };
  sentry: {
    dsn: string;
  };
  yeager: {
    world: {
      websocket: {
        host: string;
        port: number;
        path: string;
      };
    };
  };
  mocks: {
    yeager_world_ws: {
      minWaitTime: number;
      maxWaitTime: number;
      mockedEventId: number;
    };
  };
}

export const config: AppConfig = {
  env: 'development',
  logging: {
    level: process.env.LOGGING_LEVEL || 'info',
  },
  server: {
    port: process.env.SERVER_PORT ? +process.env.SERVER_PORT : 5000,
    host: '0.0.0.0',
    logs: {
      showAccess: process.env.SERVER_LOGGING_ACCESS === 'true',
      showErrors: process.env.SERVER_LOGGING_ERRORS === 'true',
      showStack: process.env.SERVER_LOGGING_STACKTRACE === 'true',
    },
    cors: {
      origin: '*',
    },
  },
  auth: {
    secretKey: process.env.AUTH_SECRET_KEY || 'thisHaveToBeChanged!',
  },
  mongodb: {
    host: process.env.DB_MONGO_HOST || 'localhost',
    port: process.env.DB_MONGO_PORT ? +process.env.DB_MONGO_PORT : 27017,
    user: process.env.DB_MONGO_USER,
    password: process.env.DB_MONGO_PASS,
  },
  redis: {
    host: process.env.DB_REDIS_HOST || 'localhost',
    port: process.env.DB_REDIS_PORT ? +process.env.DB_REDIS_PORT : 6379,
    prefix: process.env.DB_REDIS_PREFIX,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  },
  yeager: {
    world: {
      websocket: {
        host: process.env.YEAGER_WORLD_WS_HOST || 'localhost',
        port: process.env.YEAGER_WORLD_WS_PORT ? +process.env.YEAGER_WORLD_WS_PORT : 5001,
        path: process.env.YEAGER_WORLD_WS_PATH || 'world',
      },
    },
  },
  mocks: {
    yeager_world_ws: {
      minWaitTime: process.env.MOCKS_YEAGER_WORLD_WS_WAIT_TIME_MIN
        ? +process.env.MOCKS_YEAGER_WORLD_WS_WAIT_TIME_MIN : 1000,
      maxWaitTime: process.env.MOCKS_YEAGER_WORLD_WS_WAIT_TIME_MAX
        ? +process.env.MOCKS_YEAGER_WORLD_WS_WAIT_TIME_MAX : 2000,
      mockedEventId: process.env.MOCKS_YEAGER_WORLD_WS_MOCKED_EVENT_ID
        ? +process.env.MOCKS_YEAGER_WORLD_WS_MOCKED_EVENT_ID : 0,
    },
  },
};

// Node Environment
if (process.env.NODE_ENV === 'production') config.env = 'production';
else if (process.env.NODE_ENV === 'staging') config.env = 'staging';
else if (process.env.NODE_ENV === 'development') config.env = 'development';
else if (process.env.NODE_ENV === 'test') config.env = 'test';

// CORS
const parseCorsOrigins = process.env.SERVER_CORS_ORIGINS || false;
if (parseCorsOrigins) {
  config.server.cors.origin = parseCorsOrigins.split(',');
}
