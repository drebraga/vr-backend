import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { produto } from '../entity/produto.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  const createProductDto: CreateProductDto = {
    descricao: 'teste_produto',
    custo: 10,
    imagem: 'teste_imagem',
  };
  const updateProductDto: UpdateProductDto = {
    descricao: 'teste_update_produto',
    custo: 5.5,
    imagem: 'teste_update_imagem',
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
      const product = { id: 1, produtoloja: null, ...createProductDto };

      jest.spyOn(service, 'create').mockResolvedValue(product);
      const result = await controller.create(createProductDto);

      expect(result).toBe(product);
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

      jest.spyOn(service, 'findBy').mockResolvedValue(product);

      const result = await controller.findOneById('1');

      expect(result).toBe(product);
    });

    it('should return an array of products with same description', async () => {
      jest.spyOn(service, 'findBy').mockResolvedValue(products);

      const result = await controller.findByDescription('Product');

      expect(result).toBe(products);
    });

    it('should return an array of products with same cost', async () => {
      jest.spyOn(service, 'findBy').mockResolvedValue(products);

      const result = await controller.findByCost('10');

      expect(result).toBe(products);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = '1';
      const product = { id: +id, ...updateProductDto, produtoloja: null };

      jest.spyOn(service, 'update').mockResolvedValue(product);
      const result = await controller.update(id, updateProductDto);

      expect(result).toBe(product);
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
