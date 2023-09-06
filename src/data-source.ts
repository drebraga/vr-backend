import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { produto } from './entity/produto.entity';
import { produtoloja } from './entity/produtoloja.entity';
import { loja } from './entity/loja.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'vr',
  synchronize: true,
  logging: false,
  entities: [produto, produtoloja, loja],
  migrations: [],
  subscribers: [],
});
