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

const getWsUrl = (): string => {
  const wsProtocol: string = window.location.protocol === 'https:' ? 'https' : 'http';
  const currentHost: string = window.location.host;
  const url: string = `${wsProtocol}://${currentHost}/16bit-back`;
  /* eslint-disable no-console */
  console.log('url', url);
  return url;
};

const WEBSOCKETS: { [key in Environment]: string } = {
  // [Environment.DEVELOPMENT]: 'ws://localhost:3000',
  [Environment.DEVELOPMENT]: getWsUrl(),
  [Environment.STAGING]: getWsUrl(),
  [Environment.PRODUCTION]: getWsUrl(),
  // [Environment.PRODUCTION]: 'wss://changeme',
};

export function getConfig(): AppConfig {
  const env = getEnvironment();

  return {
    isDevelopment: env === Environment.DEVELOPMENT,
    websocket: WEBSOCKETS[env],
  };
}
