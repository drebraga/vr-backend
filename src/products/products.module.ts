import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { produto } from '../entity/produto';

@Module({
  imports: [TypeOrmModule.forFeature([produto])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
