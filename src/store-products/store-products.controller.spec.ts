import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductsController } from './store-products.controller';
import { StoreProductsService } from './store-products.service';
import { produtoloja } from '../entity/produtoloja.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { loja } from '../entity/loja.entity';
import { Produto } from '../entity/produto.entity';

describe('StoreProductsController', () => {
  let controller: StoreProductsController;
  let service: StoreProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreProductsController],
      providers: [
        StoreProductsService,
        {
          provide: getRepositoryToken(produtoloja),
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(Produto),
          useFactory: jest.fn(() => ({})),
        },
        {
          provide: getRepositoryToken(loja),
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile();

    controller = module.get<StoreProductsController>(StoreProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
