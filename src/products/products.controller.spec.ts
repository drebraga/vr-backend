import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produto } from '../entity/produto.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { loja } from '../entity/loja.entity';
import { produtoloja } from '../entity/produtoloja.entity';
import { EntityManager } from 'typeorm';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  const productRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const storeRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const storeProductRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const createProductDto: CreateProductDto = {
    descricao: 'teste_produto',
    custo: 10,
    imagem: 'teste_imagem',
    lojas: [
      {
        id: 1,
        precoVenda: 1.99,
      },
    ],
  };
  const updateProductDto: UpdateProductDto = {
    descricao: 'teste_update_produto',
    custo: 5.5,
    imagem: 'teste_update_imagem',
    lojas: [
      {
        id: 2,
        precoVenda: 2.99,
      },
    ],
  };
  const products = [
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Produto),
          useValue: productRepositoryMock,
        },
        {
          provide: getRepositoryToken(loja),
          useValue: storeRepositoryMock,
        },
        {
          provide: getRepositoryToken(produtoloja),
          useValue: storeProductRepositoryMock,
        },
        { provide: EntityManager, useClass: EntityManager },
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
      const product = { id: 1, produtoloja: null, ...createProductDto };

      jest.spyOn(service, 'create').mockResolvedValue(product.id);
      const result = await controller.create(createProductDto);

      expect(result).toBe(product.id);
    });
  });

  describe('find', () => {
    it('should return an array of products', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(products);

      const result = await controller.findAll();

      expect(result).toBe(products);
    });

    it('should return an array of products with same ID', async () => {
      const product = products.filter((e) => (e.id = 1));

      jest.spyOn(service, 'findById').mockResolvedValue(product[0]);

      const result = await controller.findOneById('1');

      expect(result).toBe(product[0]);
    });

    it('should return an array of products with same id, description, cost, salePrice', async () => {
      jest.spyOn(service, 'search').mockResolvedValue(products);

      const result = await controller.findBy(
        products[0].id.toString(),
        products[0].descricao.toString(),
        products[0].custo.toString(),
        updateProductDto.lojas[0].precoVenda.toString(),
      );

      expect(result).toBe(products);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = '1';

      const updateService = jest.spyOn(service, 'update').mockResolvedValue();
      await controller.update(id, updateProductDto);

      expect(updateService).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const id = '1';

      jest.spyOn(service, 'remove').mockResolvedValue(products[0]);
      const result = await controller.remove(id);

      expect(result).toBe(products[0]);
    });
  });
});
