import { config } from '@app/config';

export const getMongoDbURL = (dbName: string): string => {
  const dbSchema = 'mongodb';
  const dbServer = `${config.mongodb.host}:${config.mongodb.port}/${dbName}`;
  if (config.mongodb.user && config.mongodb.password) {
    const dbAuth = `${config.mongodb.user}:${config.mongodb.password}`;
    const dbOptions = 'authSource=admin&readPreference=primary';
    return `${dbSchema}://${dbAuth}@${dbServer}?${dbOptions}`;
  }
  return `${dbSchema}://${dbServer}`;
};
