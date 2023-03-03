import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConsultationTable1677881220616 implements MigrationInterface {
    name = 'CreateConsultationTable1677881220616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "consultations" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "patientId" integer NOT NULL, "scheduleId" integer NOT NULL, "notes" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c5b78e9424d9bc68464f6a12103" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_bf3f39de11e69153aee12b5ca9a" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_a00f58f9b1e75d30d66ee4097d6" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_e5b6a3f67f026ba680ec7934d9e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_e5b6a3f67f026ba680ec7934d9e"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_a00f58f9b1e75d30d66ee4097d6"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_bf3f39de11e69153aee12b5ca9a"`);
        await queryRunner.query(`DROP TABLE "consultations"`);
    }

}
