import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Produto } from './produto.entity';
import { loja } from './loja.entity';

@Entity()
@Unique(['produto', 'loja'])
export class produtoloja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto, (p) => p.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  produto: Produto;

  @ManyToOne(() => loja, (l) => l.id, { nullable: false, onDelete: 'CASCADE' })
  loja: loja;

  @Column('numeric', { precision: 13, scale: 3, nullable: true })
  precoVenda: number;
}
