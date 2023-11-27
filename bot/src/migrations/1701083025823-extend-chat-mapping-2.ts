import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendChatMapping21701083025823 implements MigrationInterface {
  name = "ExtendChatMapping21701083025823";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ADD "sourceChatUrl" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" DROP COLUMN "sourceChatUrl"`
    );
  }
}
