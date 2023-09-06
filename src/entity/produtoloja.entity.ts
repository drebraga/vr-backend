import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { produto } from './produto.entity';
import { loja } from './loja.entity';

@Entity()
export class produtoloja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => produto, (p) => p.id, { nullable: false })
  produto: produto;

  @ManyToOne(() => loja, (l) => l.id, { nullable: false })
  loja: loja;

  @Column('numeric', { precision: 13, scale: 3, nullable: true })
  precoVenda: number;
}