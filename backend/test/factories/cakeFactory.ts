import { AppDataSource } from "../../src/dataSource"
import { Cake } from "../../src/entities/cake";
import { faker } from "@faker-js/faker";

const cakeRepo = AppDataSource.getRepository(Cake);

type GeneratableCake = Omit<Cake, "id" | "images">;

export const generateTestCake = (override: Partial<GeneratableCake> = {}): GeneratableCake => {
    return {
        name: faker.lorem.word(10),
        comment: faker.lorem.sentence(10),
        yumFactor: faker.datatype.number({ min: 1, max: 10 }),
        ...override,
    }
};

export const createTestCake = async (data: Partial<GeneratableCake> = {}): Promise<Cake> => {
    const finalData = generateTestCake(data);
    const cake = await cakeRepo.create(finalData);
    const createdCake = await cakeRepo.save(cake);
    return createdCake;
};

export const createTestCakes = async (data: Partial<GeneratableCake>[] = []): Promise<Cake[]> => {
    const cakes = await cakeRepo.create(data.map(generateTestCake));
    const createdCakes = await cakeRepo.save(cakes);
    return createdCakes;
};
