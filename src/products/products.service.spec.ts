import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { produto } from '../entity/produto.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  const productRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const createProductDto: CreateProductDto = {
    descricao: 'teste_produto',
    custo: 10.5,
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
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(produto),
          useValue: productRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    productRepositoryMock.create.mockClear();
    productRepositoryMock.save.mockClear();
    productRepositoryMock.find.mockClear();
    productRepositoryMock.findOne.mockClear();
    productRepositoryMock.update.mockClear();
    productRepositoryMock.remove.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      productRepositoryMock.create.mockReturnValue(createProductDto);
      productRepositoryMock.save.mockReturnValue(createProductDto);

      const result = await service.create(createProductDto);

      expect(result).toBe(createProductDto);
    });
  });

  describe('find', () => {
    it('should return an array of products', async () => {
      productRepositoryMock.find.mockReturnValue(products);

      const result = await service.findAll();
      expect(result).toBe(products);
    });

    it('should return an array of products with same ID', async () => {
      const product = products.filter((e) => (e.id = 1));

      productRepositoryMock.findOne.mockReturnValue(product);

      const result = await service.findBy({ id: 1 });

      expect(result).toStrictEqual(product);
    });

    it('should return an array of products with same description', async () => {
      productRepositoryMock.findOne.mockReturnValue(products);

      const result = await service.findBy({ descricao: 'Product' });

      expect(result).toBe(products);
    });

    it('should return an array of products with same cost', async () => {
      productRepositoryMock.findOne.mockReturnValue(products);

      const result = await service.findBy({ custo: 10 });

      expect(result).toBe(products);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      productRepositoryMock.update.mockReturnValue(updateProductDto);

      const result = await service.update(1, updateProductDto);

      expect(result).toBe(updateProductDto);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      productRepositoryMock.remove.mockReturnValue(products[0]);

      const result = await service.remove(1);

      expect(result).toBe(products[0]);
    });
  });
});
