import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { produtoloja } from './produtoloja';

@Entity()
export class produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 60 })
  descricao: string;

  @Column('numeric', { precision: 13, scale: 3, nullable: true })
  custo: number;

  @Column('bytea', { nullable: true })
  imagem: string;
}
