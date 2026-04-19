import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCakeImagesTable1776548880972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cake_images" (
        "id" SERIAL PRIMARY KEY,
        "path" VARCHAR(255) NOT NULL,
        "cake_id" INTEGER NOT NULL,
        CONSTRAINT "FK_cake_images_cake"
          FOREIGN KEY ("cake_id")
          REFERENCES "cakes"("id")
          ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cake_images"`);
  }
}
