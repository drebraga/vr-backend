import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductsService } from './store-products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { produtoloja } from '../entity/produtoloja.entity';
import { loja } from '../entity/loja.entity';
import { Produto } from '../entity/produto.entity';

describe('StoreProductsService', () => {
  let service: StoreProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreProductsService,
        { provide: getRepositoryToken(produtoloja), useFactory: jest.fn },
        { provide: getRepositoryToken(loja), useFactory: jest.fn },
        { provide: getRepositoryToken(Produto), useFactory: jest.fn },
      ],
    }).compile();

    service = module.get<StoreProductsService>(StoreProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
