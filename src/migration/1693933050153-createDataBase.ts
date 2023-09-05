import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDataBase1693933050153 implements MigrationInterface {
  name = 'CreateDataBase1693933050153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "loja" ("id" SERIAL NOT NULL, "descricao" character varying(60) NOT NULL, CONSTRAINT "PK_81ad5d6a90a7a01aa53b334cea9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "produtoloja" ("id" SERIAL NOT NULL, "precoVenda" numeric(13,3), "produtoId" integer, "lojaId" integer, CONSTRAINT "PK_66ed310e837b5e92119fd2791dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "produto" ("id" SERIAL NOT NULL, "descricao" character varying(60) NOT NULL, "custo" numeric(13,3), "imagem" bytea, CONSTRAINT "PK_99c4351f9168c50c0736e6a66be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "produtoloja" ADD CONSTRAINT "FK_304e824928777e82a0d1cddb547" FOREIGN KEY ("produtoId") REFERENCES "produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "produtoloja" ADD CONSTRAINT "FK_33bd0730e3099158f73b3e22f3b" FOREIGN KEY ("lojaId") REFERENCES "loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "produtoloja" DROP CONSTRAINT "FK_33bd0730e3099158f73b3e22f3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "produtoloja" DROP CONSTRAINT "FK_304e824928777e82a0d1cddb547"`,
    );
    await queryRunner.query(`DROP TABLE "produto"`);
    await queryRunner.query(`DROP TABLE "produtoloja"`);
    await queryRunner.query(`DROP TABLE "loja"`);
  }
}
