import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { produto } from './entity/produto';
import { produtoloja } from './entity/produtoloja';
import { loja } from './entity/loja';

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
