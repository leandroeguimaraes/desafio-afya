import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePatientTable1677801026957 implements MigrationInterface {
    name = 'CreatePatientTable1677801026957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patients" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying(50) NOT NULL, "phone" character varying NOT NULL, "email" character varying(100) NOT NULL, "birthDate" TIMESTAMP NOT NULL, "gender" character varying NOT NULL, "height" numeric(3,2) NOT NULL DEFAULT '0', "weight" numeric(4,1) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_64e2031265399f5690b0beba6a5" UNIQUE ("email"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "patients" ADD CONSTRAINT "FK_2c24c3490a26d04b0d70f92057a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP CONSTRAINT "FK_2c24c3490a26d04b0d70f92057a"`);
        await queryRunner.query(`DROP TABLE "patients"`);
    }

}
