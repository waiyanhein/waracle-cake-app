import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Container from 'typedi';
import { initDotenv } from './env';
import { ConfigService } from './services/core/configService';

initDotenv();

const configService = Container.get(ConfigService);
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.getAppConfig().database.url,
  synchronize: false,
  logging: true,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};
