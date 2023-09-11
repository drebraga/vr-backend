import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produto } from '../entity/produto.entity';
import { loja } from '../entity/loja.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { produtoloja } from '../entity/produtoloja.entity';
import { EntityManager } from 'typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
  let entityManager: EntityManager;
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
  const entityManagerMock = {
    connection: {
      createQueryRunner: jest.fn(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      })),
    },
  };
  const createProductDto: CreateProductDto = {
    descricao: 'teste_produto',
    custo: 10.5,
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
        { provide: EntityManager, useValue: entityManagerMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      productRepositoryMock.save.mockReturnValue({
        ...createProductDto,
        id: 1,
      });
      entityManagerMock.connection.createQueryRunner();
      storeRepositoryMock.findOne.mockReturnValue(createProductDto.lojas[0]);
      storeProductRepositoryMock.create.mockReturnValue({
        produto: { id: 1 },
        loja: { id: createProductDto.lojas[0].id },
        precoVenda: createProductDto.lojas[0].precoVenda,
      });
      storeProductRepositoryMock.save.mockReturnValue({});

      const result = await service.create(createProductDto);

      expect(result).toBe(1);
    });

    it('should throw an error when creating a product', async () => {
      entityManagerMock.connection.createQueryRunner();

      productRepositoryMock.save.mockImplementation(() => {
        throw new Error('Simulated error during product creation');
      });

      await expect(async () => {
        await service.create(createProductDto);
      }).rejects.toThrow(
        'Error creating product: Simulated error during product creation',
      );
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

      const result = await service.search({ id: 1 });

      expect(result).toStrictEqual(product);
    });

    it('should return an array of products with same description', async () => {
      productRepositoryMock.findOne.mockReturnValue(products);

      const result = await service.search({ descricao: 'Product' });

      expect(result).toBe(products);
    });

    it('should return an array of products with same cost', async () => {
      productRepositoryMock.findOne.mockReturnValue(products);

      const result = await service.search({ custo: 10 });

      expect(result).toBe(products);
    });

    it('should return an array of products with same saleprice', async () => {
      productRepositoryMock.findOne.mockReturnValue(products);

      const result = await service.search({ precoVenda: 10 });

      expect(result).toBe(products);
    });

    it('should return an empty array of products with no params', async () => {
      productRepositoryMock.findOne.mockReturnValue(products);

      const result = await service.search({});

      expect(result).toStrictEqual([]);
    });

    it('should return an product', async () => {
      productRepositoryMock.findOne.mockReturnValue(products[0]);

      const result = await service.findById(1);

      expect(result).toStrictEqual(products[0]);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const id = 1;
      storeProductRepositoryMock.find.mockReturnValue([
        {
          id: 2,
          precoVenda: 2.99,
        },
      ]);
      storeProductRepositoryMock.remove.mockImplementation();
      productRepositoryMock.find.mockReturnValue({ id, ...updateProductDto });
      storeProductRepositoryMock.update.mockImplementation();
      storeRepositoryMock.findOne.mockReturnValue({
        id: 2,
        precoVenda: 2.99,
      });
      storeProductRepositoryMock.create.mockReturnValue(
        updateProductDto.lojas[0],
      );
      storeProductRepositoryMock.create.mockReturnValue(
        updateProductDto.lojas[0],
      );

      entityManagerMock.connection.createQueryRunner();

      await service.update(id, updateProductDto);
      const result = await service.search({ id });

      expect(result).toStrictEqual({ id, ...updateProductDto });
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      productRepositoryMock.remove.mockReturnValue(products[0]);

      const result = await service.remove(1);

      expect(result).toBe(products[0]);
    });
  });

  describe('errors', () => {
    it('should throw an error when creating a product and the store Id does not exist', async () => {
      productRepositoryMock.save.mockReturnValue({
        ...createProductDto,
        id: 1,
      });
      entityManagerMock.connection.createQueryRunner();
      storeRepositoryMock.findOne.mockReturnValue(undefined);
      productRepositoryMock.remove.mockResolvedValue(() => {
        throw new Error(
          `Store with ID ${createProductDto.lojas[0].id} not found`,
        );
      });

      try {
        await service.create(createProductDto);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          `Error creating product: Store with ID ${createProductDto.lojas[0].id} not found`,
        );
      }
    });

    it('should throw an error when creating a product and the product is not created', async () => {
      productRepositoryMock.save.mockReturnValue(() => {
        throw new Error(`Product Id is NULL`);
      });
      entityManagerMock.connection.createQueryRunner();
      storeRepositoryMock.findOne.mockReturnValue(createProductDto.lojas[0]);

      try {
        await service.create(createProductDto);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          `Error creating product: Product Id is NULL`,
        );
      }
    });

    it('should throw an error when getting all products', async () => {
      productRepositoryMock.find.mockImplementation(() => {
        throw new Error('Simulated error during finding products');
      });

      try {
        await service.findAll();

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          'Error getting products: Simulated error during finding products',
        );
      }
    });

    it('should return an error when id is NaN', async () => {
      try {
        await service.findById(NaN);
      } catch (error) {
        expect(error.message).toBe('Error getting product: Id is not a number');
      }
    });

    it('should throw an error when getting filtered products', async () => {
      productRepositoryMock.find.mockImplementation(() => {
        throw new Error('Simulated error during finding products');
      });

      try {
        await service.search({ id: 1 });

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          'Error getting products: Simulated error during finding products',
        );
      }
    });

    it('should throw an error when the product to update does not exist', async () => {
      const id = 1;
      productRepositoryMock.find.mockReturnValue([]);

      try {
        await service.update(id, updateProductDto);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          `Error updating product: Product with ID ${id} not found`,
        );
      }
    });

    it('should throw an error when the product to update store does not exist', async () => {
      const id = 1;
      storeProductRepositoryMock.find.mockReturnValue([
        {
          id: 2,
          precoVenda: 2.99,
        },
      ]);
      storeProductRepositoryMock.remove.mockImplementation();
      productRepositoryMock.find.mockReturnValue({ id, ...updateProductDto });
      storeProductRepositoryMock.update.mockImplementation();
      storeRepositoryMock.findOne.mockImplementation(() => {
        throw new Error(
          `Store with ID ${createProductDto.lojas[0].id} not found`,
        );
      });

      entityManagerMock.connection.createQueryRunner();

      try {
        await service.update(id, updateProductDto);
      } catch (error) {
        expect(error.message).toBe(
          `Error updating product: Store with ID ${createProductDto.lojas[0].id} not found`,
        );
      }
    });

    it('should throw an error when remove a product', async () => {
      productRepositoryMock.findOne.mockReturnValue(products[0]);
      productRepositoryMock.remove.mockImplementation(() => {
        throw new Error('Simulated error during updating a product');
      });

      try {
        await service.remove(1);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          'Error removing product: Simulated error during updating a product',
        );
      }
    });

    it('should throw an error when the product to remove does not exist', async () => {
      const id = 1;
      productRepositoryMock.findOne.mockReturnValue(undefined);

      try {
        await service.remove(id);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          `Error removing product: Product with ID ${id} not found`,
        );
      }
    });
  });
});
