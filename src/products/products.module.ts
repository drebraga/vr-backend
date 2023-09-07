import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from '../entity/produto.entity';
import { produtoloja } from '../entity/produtoloja.entity';
import { loja } from '../entity/loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, produtoloja, loja])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
