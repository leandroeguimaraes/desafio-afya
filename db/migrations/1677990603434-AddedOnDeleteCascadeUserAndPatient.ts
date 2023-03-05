import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedOnDeleteCascadeUserAndPatient1677990603434 implements MigrationInterface {
    name = 'AddedOnDeleteCascadeUserAndPatient1677990603434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_3b662d86d93c5febacaf65417d6"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_19c54f24597b318be3892114c75"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_2c24c3490a26d04b0d70f92057a"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_a00f58f9b1e75d30d66ee4097d6"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_e5b6a3f67f026ba680ec7934d9e"`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_19c54f24597b318be3892114c75" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_3b662d86d93c5febacaf65417d6" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_2c24c3490a26d04b0d70f92057a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_a00f58f9b1e75d30d66ee4097d6" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_e5b6a3f67f026ba680ec7934d9e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_e5b6a3f67f026ba680ec7934d9e"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_a00f58f9b1e75d30d66ee4097d6"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_2c24c3490a26d04b0d70f92057a"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_3b662d86d93c5febacaf65417d6"`);
        await queryRunner.query(`ALTER TABLE "schedules" DROP CONSTRAINT "FK_19c54f24597b318be3892114c75"`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_e5b6a3f67f026ba680ec7934d9e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_a00f58f9b1e75d30d66ee4097d6" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_2c24c3490a26d04b0d70f92057a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_19c54f24597b318be3892114c75" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedules" ADD CONSTRAINT "FK_3b662d86d93c5febacaf65417d6" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
