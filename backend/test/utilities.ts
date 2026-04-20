import { Express } from 'express';
import { initApp } from '../src/app';
import { AppDataSource, initializeDatabase } from '../src/dataSource';
import { Cake } from '../src/entities/cake';
import { CakeImage } from '../src/entities/cakeImage';
import { promises as fs, existsSync } from 'fs';
import path from 'path';
import timekeeper from 'timekeeper';
import { Response } from 'supertest';
import { isNil } from 'lodash';

let app: Express | null = null;
let runMigrations = false;
let cachedStorageDirectoryPath: string;
const cakeRepository = AppDataSource.getRepository(Cake);
const cakeImageRepository = AppDataSource.getRepository(CakeImage);

export const initTestApp = async () => {
    if (!app) {
        app = await initApp();
    }

    return app;
}

const getStorageDirectoryPath = () => {
    if (!cachedStorageDirectoryPath) {
        const storageDirectoryName = process.env.STORAGE_DIRECTORY;
        if (!storageDirectoryName) {
            throw new Error('STORAGE_DIRECTORY env variableis not set');
        }
        cachedStorageDirectoryPath = path.resolve(path.join(process.cwd(), storageDirectoryName))
    }
    return cachedStorageDirectoryPath;
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

export const withStorage = () => {
    afterEach(async () => {
        const storageDirectoryPath = getStorageDirectoryPath();
        if (existsSync(storageDirectoryPath)) {
            await fs.rm(storageDirectoryPath, { recursive: true, force: true });
        }
    });
};

export const withMockDateAll = (mockDate: Date) => {
    beforeAll(() => {
      /**
       * TODO - use this approach instead of timekeeper.  Look into why jest.useFakeTimers() is not working (timing out) when there's more time.
       */
      // jest.useFakeTimers().setSystemTime(mockDate);
      timekeeper.freeze(mockDate);
    });
  
    afterAll(() => {
      // jest.useRealTimers();
      timekeeper.reset();
    });
};

export const assertFileExistsInStorage = (filePath: string) => {
    const fullFilePath = path.resolve(process.cwd(), filePath);
    expect(existsSync(fullFilePath)).toBeTruthy();
};

export const asssertResponseHasValidationError = (response: Response, expectedError: { fieldName: string; error: string }) => {
    expect(response.status).toBe(422);
    const body: {
        errors: Record<string, string[]>;
    } = response.body;
    const resFieldError = body.errors[expectedError.fieldName];
    if (isNil(resFieldError)) {
        /**
         * @TODO - find a better way to assert this. (jest way)
         */
        throw new Error(`Response does not have expected error for field ${expectedError.fieldName}: ${expectedError.error}`);
    }
    expect(resFieldError.includes(expectedError.error)).toBeTruthy();
};
