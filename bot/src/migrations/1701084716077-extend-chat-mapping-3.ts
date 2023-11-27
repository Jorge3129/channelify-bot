import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendChatMapping31701084716077 implements MigrationInterface {
  name = "ExtendChatMapping31701084716077";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ADD "destinationChatUrl" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" DROP COLUMN "destinationChatUrl"`
    );
  }
}
