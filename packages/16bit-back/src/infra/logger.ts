import winston from 'winston';

import { config } from '@app/config';

export interface LeveledLogMethod {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (message: any): void;
}

export interface AppLogger {
  debug: LeveledLogMethod;
  info: LeveledLogMethod;
  warn: LeveledLogMethod;
  error: LeveledLogMethod;
}

export const logger = winston.createLogger({
  level: config.logging.level,
});

logger.add(new winston.transports.Console({
  format: winston.format.simple(),
}));
