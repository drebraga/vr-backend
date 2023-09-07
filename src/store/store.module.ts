import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loja } from '../entity/loja.entity';

@Module({
  imports: [TypeOrmModule.forFeature([loja])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
