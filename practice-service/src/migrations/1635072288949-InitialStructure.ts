import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialStructure1635072288949 implements MigrationInterface {
    name = 'InitialStructure1635072288949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."question_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "answer" character varying NOT NULL, "difficulty" "public"."question_difficulty_enum" NOT NULL, "questionHtml" character varying NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."session_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TYPE "public"."session_status_enum" AS ENUM('open', 'in-progress', 'closed')`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allowedUserIds" character varying array NOT NULL, "difficulty" "public"."session_difficulty_enum" NOT NULL, "status" "public"."session_status_enum" NOT NULL DEFAULT 'open', "code" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session_note" ("userId" character varying NOT NULL, "note" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "sessionId" uuid NOT NULL, CONSTRAINT "PK_4743eb7cbbd2c4ecc2867715855" PRIMARY KEY ("userId", "sessionId"))`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_92b0369a5c06a87a52618607bd7" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE INDEX "IDX_304d7cd61852cff172cde18964" ON "session" USING GIN("allowedUserIds")`);
        await queryRunner.query(`ALTER TABLE "session_note" ADD CONSTRAINT "FK_d3d7f6f9a4a5e8eecaa07598b18" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session_note" DROP CONSTRAINT "FK_d3d7f6f9a4a5e8eecaa07598b18"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_92b0369a5c06a87a52618607bd7"`);
        await queryRunner.query(`DROP INDEX "IDX_304d7cd61852cff172cde18964"`);
        await queryRunner.query(`DROP TABLE "session_note"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TYPE "public"."session_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."session_difficulty_enum"`);
        await queryRunner.query(`DROP TABLE "public"."question"`);
        await queryRunner.query(`DROP TYPE "public"."question_difficulty_enum"`);
    }

}
