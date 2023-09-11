import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { loja } from '../entity/loja.entity';

describe('StoreController', () => {
  let controller: StoreController;
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(loja),
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
