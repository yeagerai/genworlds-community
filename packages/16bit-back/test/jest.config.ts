import type { Config } from '@jest/types';

// eslint-disable-next-line import/no-default-export
export default async (): Promise<Config.InitialOptions> => {
  const maxTestWorkers = process.env.JEST_MAX_WORKERS || '25%';
  const jestVerbose = process.env.JEST_VERBOSE || 'true';

  return {
    moduleFileExtensions: ['ts', 'js'],
    rootDir: '.',
    verbose: jestVerbose === 'true',
    testEnvironment: 'node',
    testRegex: ['./.*.test.ts$'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    moduleNameMapper: {
      '@app/(.*)$': '<rootDir>/../src/$1',
      '@shared/(.*)$': '<rootDir>/../shared/$1',
      '@test/(.*)$': '<rootDir>/../test/$1',
    },
    testTimeout: 5000, // Default: 5000
    maxWorkers: maxTestWorkers,
    setupFiles: ['./test-env.ts'],
    logHeapUsage: true,
  };
};
