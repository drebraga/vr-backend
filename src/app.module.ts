import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProductsModule } from './store-products/store-products.module';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { StoreModule } from './store/store.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    ProductsModule,
    StoreProductsModule,
    StoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
