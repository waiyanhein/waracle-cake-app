import { faker } from "@faker-js/faker";
import { assertFileExistsInStorage, asssertResponseHasValidationError, initTestApp, withDatabaseEach, withMockDateAll, withStorage } from "../../utilities";
import { Express } from "express";
import supertest from "supertest";
import * as path from "path";
import { Cake } from "../../../src/entities/cake";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../src/dataSource";
import { isNil } from "lodash";
import { CakeImage } from "../../../src/entities/cakeImage";
import Container from "typedi";
import { CryptoService } from "../../../src/services/core/cryptoService";
import { StorageService } from "../../../src/services/core/storageService";
import { existsSync } from "fs";

/**
 * @todo - add more tests to cover the edge-cases such as database transaction logic.
 */
describe("POST /cakes", () => {
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
    let testUploadedImageFilePath: string;
    beforeAll(async () => {
        app = await initTestApp();
        cakeRepository = AppDataSource.getRepository(Cake);
        cakeImageRepository = AppDataSource.getRepository(CakeImage);
        testUploadedImageFilePath = `${process.env.STORAGE_DIRECTORY}/2026/04/${testUuid}.png`;
    });

    beforeEach(() => {
        jest.spyOn(cryptoService, "generateUuid").mockReturnValue(testUuid);
        deleteFileSpy = jest.spyOn(storageService, "deleteFile");
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it(`should save the cake in the database`, async () => {
        const reqDto = generateReqDto();
        await supertest(app)
        .post('/cakes')
        .field(`name`, reqDto.name)
        .field(`comment`, reqDto.comment)
        .field(`yumFactor`, reqDto.yumFactor.toString())
        .attach('imageFiles', path.resolve(__dirname, 'test_image.png'))
        .expect(201);

        const cakes = await cakeRepository.find();
        expect(cakes.length).toBe(1);
        const cake = cakes[0];
        expect(isNil(cake.id)).toBeFalsy();
        expect(cake.name).toBe(reqDto.name);
        expect(cake.comment).toBe(reqDto.comment);
        expect(cake.yumFactor).toBe(reqDto.yumFactor);
        const cakeImages = await cakeImageRepository.find();
        expect(cakeImages.length).toBe(1);
        const cakeImage = cakeImages[0];
        expect(cakeImage.id).toBeDefined();
        expect(cakeImage.path).toBe(testUploadedImageFilePath);
        expect(cakeImage.cakeId).toBe(cake.id);
        assertFileExistsInStorage(cakeImage.path);
    });

    it(`should delete the uploaded file if there's an error processign the request`, async () => {
        jest.spyOn(cakeRepository, "save").mockRejectedValue(new Error("test error"));
        const reqDto = generateReqDto();
        await supertest(app)
        .post('/cakes')
        .field(`name`, reqDto.name)
        .field(`comment`, reqDto.comment)
        .field(`yumFactor`, reqDto.yumFactor.toString())
        .attach('imageFiles', path.resolve(__dirname, 'test_image.png'))
        .expect(500);

        expect(deleteFileSpy).toHaveBeenCalledTimes(1);
        expect(deleteFileSpy).toHaveBeenCalledWith(testUploadedImageFilePath);
        expect(existsSync(testUploadedImageFilePath)).toBeFalsy();
    });

    /**
     * @TODO - add more tests to cover the remaining validation rules such uploaded file size.
     */
    describe("request validation", () => {
        it.each([
            {
                fieldName: 'name',
                value: undefined,
                expectedError: 'Name is required',
            },
            {
                fieldName: 'name',
                value: '',
                expectedError: 'Name is required',
            },
            {
                fieldName: 'comment',
                value: undefined,
                expectedError: 'Comment is required',
            },
            {
                fieldName: 'comment',
                value: '',
                expectedError: 'Comment is required',
            },
            {
                fieldName: 'yumFactor',
                value: undefined,
                expectedError: 'Yum factor is required',
            },
            {
                fieldName: 'yumFactor',
                value: 'not-a-number',
                expectedError: 'Yum factor is required',
            },
            {
                fieldName: 'yumFactor',
                value: 0,
                expectedError: 'Yum factor must be a number between 1 and 10',
            },
            {
                fieldName: 'yumFactor',
                value: 11,
                expectedError: 'Yum factor must be a number between 1 and 10',
            }
        ])(`should fail validation if the $fieldName field's value is $value`, async ({ fieldName, value, expectedError }) => {
            const req = supertest(app)
            .post('/cakes');
            if (!isNil(value)) {
                req.field(fieldName, value);
            }
            const response = await req
            .attach('imageFiles', path.resolve(__dirname, 'test_image.png'))
            .expect(422);

            asssertResponseHasValidationError(response, { fieldName, error: expectedError });
        });

        it(`should fail validation if an image is not provided`, async () => {
            const response = await supertest(app)
            .post('/cakes')
            .expect(422);

            asssertResponseHasValidationError(response, { fieldName: 'imageFiles', error: 'Image is required' });
        });
    });

    const generateReqDto = () => {
        return {
            name: faker.lorem.word(2),
            comment: faker.lorem.sentence(2),
            yumFactor: faker.datatype.number({ min: 1, max: 10 }),
        };
    }
});
