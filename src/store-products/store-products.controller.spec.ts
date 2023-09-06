import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductsController } from './store-products.controller';
import { StoreProductsService } from './store-products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { produtoloja } from '../entity/produtoloja.entity';
import { ProductsService } from '../products/products.service';
import { loja } from '../entity/loja.entity';
import { produto } from '../entity/produto.entity';

describe('StoreProductsController', () => {
  let controller: StoreProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreProductsController],
      providers: [
        StoreProductsService,
        ProductsService,
        { provide: getRepositoryToken(produtoloja), useFactory: jest.fn },
        { provide: getRepositoryToken(loja), useFactory: jest.fn },
        { provide: getRepositoryToken(produto), useFactory: jest.fn },
      ],
    }).compile();

    controller = module.get<StoreProductsController>(StoreProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
