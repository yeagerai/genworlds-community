export enum Environment {
  DEVELOPMENT,
  STAGING,
  PRODUCTION,
}

export interface AppConfig {
  isDevelopment: boolean;
  websocket: string;
}

function getEnvironment(): Environment {
  let environment: Environment;

  switch (process.env.NODE_ENV) {
    case 'dev':
    case 'development':
      environment = Environment.DEVELOPMENT;
      break;
    case 'stg':
    case 'staging':
      environment = Environment.STAGING;
      break;
    case 'prod':
    case 'production':
    default:
      environment = Environment.PRODUCTION;
      break;
  }

  return environment;
}

const WEBSOCKETS: { [key in Environment]: string } = {
  // [Environment.DEVELOPMENT]: 'ws://localhost:3000',
  [Environment.DEVELOPMENT]: 'ws://localhost:5000',
  [Environment.STAGING]: 'ws://localhost:5000',
  [Environment.PRODUCTION]: 'ws://localhost:5000',
  // [Environment.PRODUCTION]: 'wss://changeme',
};

export function getConfig(): AppConfig {
  const env = getEnvironment();

  return {
    isDevelopment: env === Environment.DEVELOPMENT,
    websocket: WEBSOCKETS[env],
  };
}
