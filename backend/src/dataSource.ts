import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import Container from 'typedi';
import { ConfigService } from './services/core/configService';
dotenv.config();

const configService = Container.get(ConfigService);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: configService.getAppConfig().database.url,
  synchronize: false,
  logging: true,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
});
