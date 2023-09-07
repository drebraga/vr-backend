import { Module } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';
import { produtoloja } from '../entity/produtoloja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { Produto } from '../entity/produto.entity';
import { loja } from '../entity/loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([produtoloja, Produto, loja])],
  controllers: [StoreProductsController],
  providers: [StoreProductsService, ProductsService],
})
export class StoreProductsModule {}
