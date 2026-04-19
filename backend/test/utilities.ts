import { Express } from 'express';
import { initApp } from '../src/app';
import { AppDataSource, initializeDatabase } from '../src/dataSource';
import { Cake } from '../src/entities/cake';
import { CakeImage } from '../src/entities/cakeImage';

let app: Express | null = null;
let runMigrations = false;
const cakeRepository = AppDataSource.getRepository(Cake);
const cakeImageRepository = AppDataSource.getRepository(CakeImage);

export const initTestApp = async () => {
    if (!app) {
        app = await initApp();
    }

    return app;
}

export const withDatabaseEach = () => {
    beforeEach(async () => {
        await initializeDatabase();
        if (!runMigrations) {
            await AppDataSource.runMigrations();
            runMigrations = true;
        }
    });

    afterEach(async () => {
        // purge the test data.
        if (AppDataSource.isInitialized) {
            /**
             * @TODO - purge using better approach.
             */
            await cakeImageRepository.deleteAll();
            await cakeRepository.deleteAll();
        }
    });
}
