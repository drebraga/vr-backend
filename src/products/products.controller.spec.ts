import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { produto } from '../entity/produto.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(produto),
          useFactory: jest.fn(() => ({})),
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        descricao: 'teste_produto',
        custo: 10,
        imagem: 'teste_imagem',
      };

      const expectedResult = { id: 1, produtoloja: null, ...createProductDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);
      const result = await controller.create(createProductDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('find', () => {
    it('should return an array of products', async () => {
      const expectedResult = [
        {
          id: 1,
          descricao: 'Product 1',
          custo: 10,
          imagem: 'teste_imagem',
          produtoloja: null,
        },
        {
          id: 2,
          descricao: 'Product 2',
          custo: 10,
          imagem: 'teste_imagem',
          produtoloja: null,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);
      const result = await controller.findAll();
      expect(result).toBe(expectedResult);
    });

    it('should return an array of products with same ID', async () => {
      const expectedResult = [
        {
          id: 1,
          descricao: 'Product 1',
          custo: 10,
          imagem: 'teste_imagem',
          produtoloja: null,
        },
      ];

      jest.spyOn(service, 'findBy').mockResolvedValue(expectedResult);
      const result = await controller.findOneById('1');
      expect(result).toBe(expectedResult);
    });

    it('should return an array of products with same description', async () => {
      const expectedResult = [
        {
          id: 1,
          descricao: 'Product 1',
          custo: 10,
          imagem: 'teste_imagem',
          produtoloja: null,
        },
        {
          id: 2,
          descricao: 'Product 2',
          custo: 10,
          imagem: 'teste_imagem',
          produtoloja: null,
        },
      ];

      jest.spyOn(service, 'findBy').mockResolvedValue(expectedResult);
      const result = await controller.findByDescription('Product');
      expect(result).toBe(expectedResult);
    });

    it('should return an array of products with same cost', async () => {
      const expectedResult = [
        {
          id: 1,
          descricao: 'Product 1',
          custo: 10,
          imagem: 'teste_imagem',
          produtoloja: null,
        },
        {
          id: 2,
          descricao: 'Product 2',
          custo: 10,
          imagem: 'teste_imagem',
          produtoloja: null,
        },
      ];

      jest.spyOn(service, 'findBy').mockResolvedValue(expectedResult);
      const result = await controller.findByCost(10);
      expect(result).toBe(expectedResult);
    });
  });
});
