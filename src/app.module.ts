import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProductsModule } from './store-products/store-products.module';
import { produto } from './entity/produto';
import { loja } from './entity/loja';
import { produtoloja } from './entity/produtoloja';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'vr',
      entities: [produto, loja, produtoloja],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductsModule,
    StoreProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
