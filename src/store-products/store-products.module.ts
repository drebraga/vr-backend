import { Module } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';
import { produtoloja } from '../entity/produtoloja';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { produto } from '../entity/produto';
import { loja } from '../entity/loja';

@Module({
  imports: [TypeOrmModule.forFeature([produtoloja, produto, loja])],
  controllers: [StoreProductsController],
  providers: [StoreProductsService, ProductsService],
})
export class StoreProductsModule {}
