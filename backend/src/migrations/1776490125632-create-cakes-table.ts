import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCakesTable1776490125632 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE "cakes" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(30) NOT NULL,
            "comment" VARCHAR(255) NOT NULL,
            "yumFactor" INTEGER NOT NULL,
            "imageUrl" VARCHAR(255),
            CONSTRAINT "CHK_yumFactor_range"
              CHECK ("yumFactor" >= 1 AND "yumFactor" <= 10)
          )
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cakes"`);
      }

}
