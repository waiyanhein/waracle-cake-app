import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Container from 'typedi';
import { initDotenv } from './env';
import { ConfigService } from './services/core/configService';

initDotenv();

const configService = Container.get(ConfigService);

const config = configService.getAppConfig();
const entities = config.env === 'production' ? ['dist/entities/*.js'] : ['src/entities/*.ts'];
const migrations = config.env === 'production' ? ['dist/migrations/*.js'] : ['src/migrations/*.ts'];

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  synchronize: false,
  logging: config.env !== 'production',
  entities,
  migrations,
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};
