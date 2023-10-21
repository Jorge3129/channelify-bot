import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChannelMapping1697922311041 implements MigrationInterface {
  name = "AddChannelMapping1697922311041";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "channel_mappings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sourceChatId" character varying NOT NULL, "destinationId" character varying NOT NULL, CONSTRAINT "PK_27a88f7e1db4768615cede5bdc6" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "channel_mappings"`);
  }
}
