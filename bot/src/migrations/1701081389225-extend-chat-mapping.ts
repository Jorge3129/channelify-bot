import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendChatMapping1701081389225 implements MigrationInterface {
  name = "ExtendChatMapping1701081389225";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ADD "sourceChat" jsonb NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ADD "destinationChat" jsonb NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ADD "inviteLink" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" DROP COLUMN "inviteLink"`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" DROP COLUMN "destinationChat"`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" DROP COLUMN "sourceChat"`
    );
  }
}
