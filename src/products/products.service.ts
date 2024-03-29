import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityManager, FindOperator, ILike, Repository } from 'typeorm';
import { Produto } from '../entity/produto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { loja } from '../entity/loja.entity';
import { produtoloja } from '../entity/produtoloja.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Produto)
    private productRepository: Repository<Produto>,
    @InjectRepository(loja)
    private storeRepository: Repository<loja>,
    @InjectRepository(produtoloja)
    private storeProductRepository: Repository<produtoloja>,
    private entityManager: EntityManager,
  ) {}

  async create(createProductDto: CreateProductDto) {
    let insertProduct;
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = {
        descricao: createProductDto.descricao,
        custo: createProductDto.custo,
        imagem: createProductDto.imagem,
      };

      insertProduct = await this.productRepository.save(product);

      for (const store of createProductDto.lojas) {
        const storeExists = await this.storeRepository.findOne({
          where: { id: store.id },
        });
        if (!storeExists) {
          throw new Error(`Store with ID ${store.id} not found`);
        }
        const createPricesResource = {
          produto: { id: +insertProduct.id },
          loja: { id: store.id },
          precoVenda: store.precoVenda,
        };

        if (
          isNaN(createPricesResource.produto.id) ||
          createPricesResource.produto.id === null
        ) {
          throw Error('Product Id is NULL');
        }

        const newProductStore =
          this.storeProductRepository.create(createPricesResource);

        await this.storeProductRepository.save(newProductStore);
      }

      await queryRunner.commitTransaction();
      return insertProduct.id;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (insertProduct) {
        await this.productRepository.remove(insertProduct.id);
      }

      throw new Error(`Error creating product: ${error.message}`);
    } finally {
      queryRunner.release();
    }
  }

  findAll() {
    try {
      return this.productRepository.find({ order: { id: 'ASC' } });
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async search(params: {
    id?: number;
    descricao?: string;
    custo?: number;
    precoVenda?: number;
  }) {
    if (
      !params?.id &&
      !params?.descricao &&
      !params?.custo &&
      !params?.precoVenda
    )
      return [];

    try {
      const searchParams = { produtoloja: {} } as {
        id?: number;
        descricao?: FindOperator<string>;
        custo?: number;
        produtoloja: { precoVenda?: number };
      };
      if (!isNaN(params?.id)) searchParams.id = params.id;
      if (params?.descricao)
        searchParams.descricao = ILike(`%${params.descricao}%`);
      if (!isNaN(params?.custo)) searchParams.custo = params.custo;
      if (!isNaN(params?.precoVenda)) {
        searchParams.produtoloja.precoVenda = params.precoVenda;
      }

      const products = await this.productRepository.find({
        where: { ...searchParams },
      });
      return products;
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
      if (isNaN(id) && id !== undefined) {
        throw Error('Id is not a number');
      }
      const [product] = await this.productRepository.find({ where: { id } });
      return product;
    } catch (error) {
      throw new Error(`Error getting product: ${error.message}`);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let productToUpdate;
    let storesRecover = [] as produtoloja[];
    const storesToDelete = [] as produtoloja[];
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const storesRecoverResponse = await this.storeProductRepository.find({
        where: { produto: { id } },
      });
      storesRecover = [...storesRecoverResponse];
      await this.storeProductRepository.remove(storesRecoverResponse);
      productToUpdate = await this.productRepository.find({
        where: { id },
      });
      if (productToUpdate.length === 0) {
        throw new Error(`Product with ID ${id} not found`);
      }

      const product = {
        descricao: updateProductDto.descricao,
        custo: updateProductDto.custo,
        imagem: updateProductDto.imagem,
      };

      await this.productRepository.update(id, product);

      for (const store of updateProductDto.lojas) {
        const storeExists = await this.storeRepository.findOne({
          where: { id: store.id },
        });
        if (!storeExists) {
          throw new Error(`Store with ID ${store.id} not found`);
        }

        const createPricesResource = {
          produto: { id: id },
          loja: { id: store.id },
          precoVenda: store.precoVenda,
        };

        if (
          isNaN(createPricesResource.produto.id) ||
          createPricesResource.produto.id === null
        ) {
          throw Error('Product Id is NULL');
        }

        const newProductStore =
          this.storeProductRepository.create(createPricesResource);

        const storeToRemove =
          await this.storeProductRepository.save(newProductStore);
        storesToDelete.push(storeToRemove);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (productToUpdate) {
        await this.productRepository.update(productToUpdate.id, {
          descricao: productToUpdate.descricao,
          custo: productToUpdate.custo,
          imagem: productToUpdate.imagem,
        });
      }
      if (storesToDelete.length > 0) {
        for (const stores of storesToDelete) {
          await this.storeProductRepository.remove(stores);
        }
      }
      if (storesRecover.length > 0) {
        for (const stores of storesRecover) {
          await this.storeProductRepository.save(stores);
        }
      }

      throw new Error(`Error updating product: ${error.message}`);
    } finally {
      queryRunner.release();
    }
  }

  async remove(id: number) {
    try {
      const productToRemove = await this.productRepository.findOne({
        where: { id },
      });
      if (!productToRemove) {
        throw new Error(`Product with ID ${id} not found`);
      }

      return this.productRepository.remove(productToRemove);
    } catch (error) {
      throw new Error(`Error removing product: ${error.message}`);
    }
  }
}
