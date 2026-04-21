import { faker } from "@faker-js/faker";
import { assertFileExistsInStorage, asssertResponseHasValidationError, initTestApp, withDatabaseEach, withMockDateAll, withStorage } from "../../utilities";
import { Express } from "express";
import supertest from "supertest";
import { Cake } from "../../../src/entities/cake";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../src/dataSource";
import { isNil } from "lodash";
import { CakeImage } from "../../../src/entities/cakeImage";
import Container from "typedi";
import { CryptoService } from "../../../src/services/core/cryptoService";
import { StorageService } from "../../../src/services/core/storageService";
import { existsSync } from "fs";
import { createTestCake, createTestCakes } from "../../factories/cakeFactory";
import { createTestCakeImage } from "../../factories/cakeImageFactory";
import { mkdir, copyFile } from 'fs/promises';
import path from 'path';

describe("PUT /cakes/:id", () => {
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

    it(`should update the cake that matches the provided id`, async () => {
        const [ cakeToIgnore, cakeToUpdate ] = await createTestCakes([
            {},
            {},
        ]);
        const cakeImageMap: Record<number, CakeImage> = {};
        for (const cake of [ cakeToIgnore, cakeToUpdate ]) {
            const preExistingImagePath = await seedImageFileInTestStorage();
            const cakeImage = await createTestCakeImage({
                cakeId: cake.id,
                path: preExistingImagePath,
            });
            cakeImageMap[cake.id] = cakeImage;
        }
        const reqDto = generateReqDto();
        await supertest(app)
        .put(`/cakes/${cakeToUpdate.id}`)
        .field(`name`, reqDto.name)
        .field(`comment`, reqDto.comment)
        .field(`yumFactor`, reqDto.yumFactor.toString())
        .attach('imageFiles', path.resolve(__dirname, 'test_image.png'))
        .expect(200);

        const cakesAfter = await cakeRepository.find({
            order: {
                id: "DESC",
            }
        });
        expect(cakesAfter.length).toBe(2);
        const cakeToUpdateAfter = cakesAfter[0];
        expect(cakeToUpdateAfter.id).toBe(cakeToUpdate.id);
        expect(cakeToUpdateAfter.name).toBe(reqDto.name);
        expect(cakeToUpdateAfter.comment).toBe(reqDto.comment);
        expect(cakeToUpdateAfter.yumFactor).toBe(reqDto.yumFactor);
        const cakeImagesAfter = await cakeImageRepository.find({
            order: {
                cakeId: "DESC",
            }
        });
        expect(cakeImagesAfter.length).toBe(2);
        const newCakeImage = cakeImagesAfter[0];
        const cakeImageToReplaceBefore = cakeImageMap[cakeToUpdate.id];
        expect(newCakeImage.path).not.toBe(cakeImageToReplaceBefore.path);
        expect(newCakeImage.path).toBe(testUploadedImageFilePath);
        expect(newCakeImage.cakeId).toBe(cakeToUpdate.id);
        assertFileExistsInStorage(newCakeImage.path);
        expect(deleteFileSpy).toHaveBeenCalledTimes(1);
        expect(deleteFileSpy).toHaveBeenCalledWith(cakeImageToReplaceBefore.path);
        expect(existsSync(cakeImageToReplaceBefore.path)).toBeFalsy();

        // ensure that another cake remains intact
        const cakeToIgnoreAfter = cakesAfter[1];
        expect(cakeToIgnoreAfter).toEqual(cakeToIgnore);
        const cakeImageToIgnoreBefore = cakeImageMap[cakeToIgnore.id];
        const cakeImageToIgnoreAfter = cakeImagesAfter[1];
        expect(cakeImageToIgnoreAfter).toEqual(cakeImageToIgnoreBefore);
        // ensure that image is not deleted
        assertFileExistsInStorage(cakeImageToIgnoreBefore.path);
    });

    it(`should not delete the pre-existing image if a new image is not uploaded`, async () => {
        const cake = await createTestCake();
        const preExistingImagePath = await seedImageFileInTestStorage();
        const cakeImage = await createTestCakeImage({
            cakeId: cake.id,
            path: preExistingImagePath,
        });
        const reqDto = generateReqDto();
        await supertest(app)
        .put(`/cakes/${cake.id}`)
        .field(`name`, reqDto.name)
        .field(`comment`, reqDto.comment)
        .field(`yumFactor`, reqDto.yumFactor.toString())
        .expect(200);

        const cakeImages = await cakeImageRepository.find();
        expect(cakeImages.length).toBe(1);
        const cakeImageAfter = cakeImages[0];
        expect(cakeImageAfter).toEqual(cakeImage);
        assertFileExistsInStorage(cakeImageAfter.path);
        expect(deleteFileSpy).not.toHaveBeenCalled();
    });

    it(`should return not found error if the cake that matches the provided id does not exist`, async () => {
        const reqDto = generateReqDto();
        await supertest(app)
        .put(`/cakes/123`) // cake does not exist for this id
        .field(`name`, reqDto.name)
        .field(`comment`, reqDto.comment)
        .field(`yumFactor`, reqDto.yumFactor.toString())
        .attach('imageFiles', path.resolve(__dirname, 'test_image.png'))
        .expect(404);
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
            const cake = await createTestCake();
            await createTestCakeImage({
                cakeId: cake.id,
                path: await seedImageFileInTestStorage(),
            });
            const req = supertest(app)
            .put(`/cakes/${cake.id}`);
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

    const seedImageFileInTestStorage = async () => {
        const preExistingImagePath = `${process.env.STORAGE_DIRECTORY}/2025/01/${faker.datatype.uuid()}.png`;
        const sourceTestImagePath = path.resolve(__dirname, 'test_image.png');
        await mkdir(path.dirname(preExistingImagePath), { recursive: true }); // ensures folders exist
        await copyFile(sourceTestImagePath, preExistingImagePath);

        return preExistingImagePath;
    }
});
