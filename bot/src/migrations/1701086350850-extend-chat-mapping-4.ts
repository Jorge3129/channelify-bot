import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendChatMapping41701086350850 implements MigrationInterface {
  name = "ExtendChatMapping41701086350850";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "sourceChatId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "sourceChat" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "destinationId" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "destinationChat" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "inviteLink" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "inviteLink" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "destinationChat" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "destinationId" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "sourceChat" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "channel_mappings" ALTER COLUMN "sourceChatId" SET NOT NULL`
    );
  }
}
