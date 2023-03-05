import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOnDeleteCascadeSchedule1677995842718 implements MigrationInterface {
    name = 'AddedOnDeleteCascadeSchedule1677995842718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_bf3f39de11e69153aee12b5ca9a"`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_bf3f39de11e69153aee12b5ca9a" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_bf3f39de11e69153aee12b5ca9a"`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_bf3f39de11e69153aee12b5ca9a" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
