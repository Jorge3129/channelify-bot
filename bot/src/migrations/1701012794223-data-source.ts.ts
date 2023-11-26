import { MigrationInterface, QueryRunner } from "typeorm";

export class DataSourcets1701012794223 implements MigrationInterface {
  name = "DataSource.ts1701012794223";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tokens" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "PK_d417e5d35f2434afc4bd48cb4d2"`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "PK_bd6ba32a32f95917b0a0c4ac612" PRIMARY KEY ("userId", "id")`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "PK_bd6ba32a32f95917b0a0c4ac612"`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id")`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ALTER COLUMN "userId" DROP DEFAULT`
    );
    await queryRunner.query(`DROP SEQUENCE "tokens_userId_seq"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "tokens_userId_seq" OWNED BY "tokens"."userId"`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ALTER COLUMN "userId" SET DEFAULT nextval('"tokens_userId_seq"')`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "PK_3001e89ada36263dabf1fb6210a"`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "PK_bd6ba32a32f95917b0a0c4ac612" PRIMARY KEY ("userId", "id")`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" DROP CONSTRAINT "PK_bd6ba32a32f95917b0a0c4ac612"`
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "PK_d417e5d35f2434afc4bd48cb4d2" PRIMARY KEY ("userId")`
    );
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "id"`);
  }
}
