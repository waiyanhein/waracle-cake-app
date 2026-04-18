import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { appConfig } from "./appConfig";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: appConfig.database.url,
  synchronize: false,
  logging: true,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
});