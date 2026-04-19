import { AppDataSource } from "../../src/dataSource"
import { faker } from "@faker-js/faker";
import { CakeImage } from "../../src/entities/cakeImage";

type GeneratableCakeImage = Omit<CakeImage, "id" | "cake">;

const cakeImageRepo = AppDataSource.getRepository(CakeImage);

export const generateTestCakeImage = (override: Partial<GeneratableCakeImage> = {}): GeneratableCakeImage => {
    const path = `${process.env.STORAGE_DIRECTORY}/${faker.lorem.word()}/${faker.lorem.word()}.png`;
    return {
        path,
        cakeId: override.cakeId ?? faker.datatype.number({ min: 1 }),
        ...override,
    }
};

export const createTestCakeImage = async (data: Partial<GeneratableCakeImage> = {}): Promise<CakeImage> => {
    const finalData = generateTestCakeImage(data);
    const cakeImage = await cakeImageRepo.create(finalData);
    const createdCakeImage = await cakeImageRepo.save(cakeImage);
    return createdCakeImage;
};
