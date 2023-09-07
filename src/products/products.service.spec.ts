import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Produto } from '../entity/produto.entity';
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
    lojas: [],
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
          provide: getRepositoryToken(Produto),
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

    it('should throw an error when creating a product', async () => {
      productRepositoryMock.create.mockImplementation(() => {
        throw new Error('Simulated error during product creation');
      });

      try {
        await service.create(createProductDto);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          'Error creating product: Simulated error during product creation',
        );
      }
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
      const id = 1;
      productRepositoryMock.find.mockReturnValue({ id, ...updateProductDto });
      productRepositoryMock.update.mockReturnValue({});

      await service.update(id, updateProductDto);
      const result = await service.findBy({ id });

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

    it('should throw an error when id is not a number', async () => {
      const params = { id: NaN };

      try {
        await service.findBy(params);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe('Id is not a number');
      }
    });

    it('should throw an error when descricao is not a string', async () => {
      const params = {
        descricao:
          'simulacao_de_descricao_com_mais_de_sessenta_caracteres_123456789',
      };

      try {
        await service.findBy(params);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe('Descrição is larger then expected');
      }
    });

    it('should throw an error when custo is not a number', async () => {
      const params = { custo: NaN };

      try {
        await service.findBy(params);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe('Custo is not a number');
      }
    });

    it('should throw an error when getting filtered products', async () => {
      productRepositoryMock.find.mockImplementation(() => {
        throw new Error('Simulated error during finding products');
      });

      try {
        await service.findBy({ id: 1 });

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          'Error getting products: Simulated error during finding products',
        );
      }
    });

    it('should throw an error when updating a product', async () => {
      productRepositoryMock.find.mockReturnValue(products);
      productRepositoryMock.update.mockImplementation(() => {
        throw new Error('Simulated error during updating a product');
      });

      try {
        await service.update(1, updateProductDto);

        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).toBe(
          'Error updating product: Simulated error during updating a product',
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
