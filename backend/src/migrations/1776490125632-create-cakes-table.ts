import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCakesTable1776490125632 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE "cakes" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR(30) NOT NULL,
            "comment" VARCHAR(255) NOT NULL,
            "yum_factor" INTEGER NOT NULL,
            CONSTRAINT "CHK_yum_factor_range"
              CHECK ("yum_factor" >= 1 AND "yum_factor" <= 10)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cakes"`);
  }
}
