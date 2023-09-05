import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { produto } from './produto';
import { loja } from './loja';

@Entity()
export class produtoloja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => produto, (produto) => produto.id)
  produto: produto;

  @ManyToOne(() => loja, (loja) => loja.id)
  loja: loja;

  @Column('numeric', { precision: 13, scale: 3, nullable: true })
  precoVenda: number;
}
