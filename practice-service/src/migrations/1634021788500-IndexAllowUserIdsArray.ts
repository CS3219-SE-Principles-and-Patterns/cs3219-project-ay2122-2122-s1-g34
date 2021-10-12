import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexAllowUserIdsArray1634021788500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_304d7cd61852cff172cde18964" ON "session" USING GIN("allowedUserIds") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_304d7cd61852cff172cde18964"`);
  }
}
