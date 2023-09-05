import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { produtoloja } from './produtoloja';

@Entity()
export class loja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 60 })
  descricao: string;

  @OneToMany(() => produtoloja, (produtoloja) => produtoloja.id)
  produtoloja: produtoloja[];
}
