import { initTestApp, withDatabaseEach } from "../../utilities";
import { Express } from "express";
import supertest from "supertest";
import { createTestCakes } from "../../factories/cakeFactory";
import { createTestCakeImage } from "../../factories/cakeImageFactory";
import { CakeImage } from "../../../src/entities/cakeImage";
import { Cake } from "../../../src/entities/cake";

/**
 * @TODO - add more tests to cover the edge-cases such as "it should use 1 as default page if the page is not provided"
 */
describe("GET /cakes", () => {
    withDatabaseEach();
    let app: Express;
    beforeAll(async () => {
        app = await initTestApp();
    });

    it(`should return the cakes in the correct JSON structure`, async () => {
        const cakes = await createTestCakes([
            {},
            {},
            {},
        ]);
        const cakeImageMap: Record<number, CakeImage> = {};
        for (const cake of cakes) {
            const cakeImage = await createTestCakeImage({
                cakeId: cake.id,
            });
            cakeImageMap[cake.id] = cakeImage;
        }
        const response = await supertest(app)
        .get('/cakes?page=1&recordsPerPage=10')
        .expect(200);

        // The most recent cakes should be at the top
        const expectedCakes = cakes.sort((a, b) => b.id - a.id).map(cake => {
            return toExpectedCakeResDto(cake, cakeImageMap[cake.id]!.path!);
        });

        expect(response.body).toEqual({
            items: expectedCakes,
            totalItems: cakes.length,
            totalPages: 1,
            page: 1,
            recordsPerPage: 10,
        });
    });

    it(`should be able to paginate through the cake list`, async () => {
        const cakes = await createTestCakes([
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]);
        const sortedCakes = cakes.sort((a, b) => b.id - a.id);
        const cakeImageMap: Record<number, CakeImage> = {};
        for (const cake of sortedCakes) {
            const cakeImage = await createTestCakeImage({
                cakeId: cake.id,
            });
            cakeImageMap[cake.id] = cakeImage;
        }
        let response = await supertest(app)
        .get('/cakes?page=1&recordsPerPage=4')
        .expect(200);
        const expectedPage1Cakes = sortedCakes.slice(0, 4).map(cake => toExpectedCakeResDto(cake, cakeImageMap[cake.id]!.path!));
        expect(response.body).toEqual({
            items: expectedPage1Cakes,
            totalItems: 7,
            totalPages: 2,
            page: 1,
            recordsPerPage: 4,
        });
        response = await supertest(app)
        .get('/cakes?page=2&recordsPerPage=4')
        .expect(200);
        const expectedPage2Cakes = sortedCakes.slice(4, 7).map(cake => toExpectedCakeResDto(cake, cakeImageMap[cake.id]!.path!));
        expect(response.body).toEqual({
            items: expectedPage2Cakes,
            totalItems: sortedCakes.length,
            totalPages: 2,
            page: 2,
            recordsPerPage: 4,
        });
    });

    const toExpectedCakeResDto = (cake: Cake, cakeImagePath: string) => {
        return {
            id: cake.id,
            name: cake.name,
            comment: cake.comment,
            yumFactor: cake.yumFactor,
            imageUrl: `${process.env.ASSET_DOMAIN}/${cakeImagePath}`,
        };
    }
});
