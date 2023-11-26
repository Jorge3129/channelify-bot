import { MigrationInterface, QueryRunner } from "typeorm";

export class DataSourceTs1701011628988 implements MigrationInterface {
  name = "DataSource.ts1701011628988";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens" ("userId" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_d417e5d35f2434afc4bd48cb4d2" PRIMARY KEY ("userId"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
