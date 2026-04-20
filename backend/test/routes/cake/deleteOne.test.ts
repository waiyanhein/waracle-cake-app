import { faker } from "@faker-js/faker";
import { initTestApp, withDatabaseEach, withMockDateAll, withStorage } from "../../utilities";
import { Express } from "express";
import supertest from "supertest";
import { Cake } from "../../../src/entities/cake";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../src/dataSource";
import { CakeImage } from "../../../src/entities/cakeImage";
import Container from "typedi";
import { CryptoService } from "../../../src/services/core/cryptoService";
import { StorageService } from "../../../src/services/core/storageService";
import { existsSync } from "fs";
import { createTestCakes } from "../../factories/cakeFactory";
import { createTestCakeImage } from "../../factories/cakeImageFactory";
import { mkdir, copyFile } from 'fs/promises';
import path from 'path';

/**
 * @TODO - add tests to cover more edge-cases such as database transaction logic.
 */
describe("DELETE /cakes/:id", () => {
    const mockDate = new Date("2026-04-20T00:00:00.000Z");
    withMockDateAll(mockDate);
    withDatabaseEach();
    withStorage();
    let app: Express;
    let cakeRepository: Repository<Cake>;
    let cakeImageRepository: Repository<CakeImage>;
    const cryptoService = Container.get(CryptoService);
    const storageService = Container.get(StorageService);
    let deleteFileSpy: jest.SpyInstance;
    const testUuid = faker.datatype.uuid();
    beforeAll(async () => {
        app = await initTestApp();
        cakeRepository = AppDataSource.getRepository(Cake);
        cakeImageRepository = AppDataSource.getRepository(CakeImage);
    });

    beforeEach(() => {
        jest.spyOn(cryptoService, "generateUuid").mockReturnValue(testUuid);
        deleteFileSpy = jest.spyOn(storageService, "deleteFile");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it(`should delete the cake that matches the provided id`, async () => {
        const [ cakeToIgnore, cakeToDelete ] = await createTestCakes([
            {},
            {},
        ]);
        const cakeImageMap: Record<number, CakeImage> = {};
        for (const cake of [ cakeToIgnore, cakeToDelete ]) {
            const preExistingImagePath = await seedImageFileInTestStorage();
            const cakeImage = await createTestCakeImage({
                cakeId: cake.id,
                path: preExistingImagePath,
            });
            cakeImageMap[cake.id] = cakeImage;
        }
        await supertest(app)
        .delete(`/cakes/${cakeToDelete.id}`)
        .expect(200);
        
        const cakesAfter = await cakeRepository.find({
            order: {
                id: "DESC",
            }
        });
        expect(cakesAfter.length).toBe(1);
        const cakeToIgnoreAfter = cakesAfter[0];
        expect(cakeToIgnoreAfter).toEqual(cakeToIgnore);
        // ensire that the cake image is also deleted
        const cakeImageToDelete = cakeImageMap[cakeToDelete.id];
        expect(deleteFileSpy).toHaveBeenCalledTimes(1);
        expect(deleteFileSpy).toHaveBeenCalledWith(cakeImageToDelete.path);
        expect(existsSync(cakeImageToDelete.path)).toBeFalsy();

        const cakeImagesAfter = await cakeImageRepository.find({
            order: {
                cakeId: "DESC",
            }
        });
        expect(cakeImagesAfter.length).toBe(1);
        expect(cakeImagesAfter[0]).toEqual(cakeImageMap[cakeToIgnore.id]);
    });

    it(`should return not found error if cake that matches the provided id does not exist`, async () => {
        await supertest(app)
        .delete(`/cakes/123`) // cake does not exist for this id
        .expect(404);
    });

    const seedImageFileInTestStorage = async () => {
        const preExistingImagePath = `${process.env.STORAGE_DIRECTORY}/2025/01/${faker.datatype.uuid()}.png`;
        const sourceTestImagePath = path.resolve(__dirname, 'test_image.png');
        await mkdir(path.dirname(preExistingImagePath), { recursive: true }); // ensures folders exist
        await copyFile(sourceTestImagePath, preExistingImagePath);

        return preExistingImagePath;
    }
});
