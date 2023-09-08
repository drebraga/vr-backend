import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityManager, ILike, Repository } from 'typeorm';
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new Error(`Entrada duplicada para produto e loja`);
      }

      if (insertProduct) {
        await this.productRepository.delete(insertProduct.id);
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

  findBy(params: { id?: number; descricao?: string; custo?: number }) {
    if (isNaN(params.id) && params.id !== undefined) {
      throw Error('Id is not a number');
    }
    if (params.descricao && params.descricao.length > 60) {
      throw Error('Descrição is larger then expected');
    }
    if (isNaN(params.custo) && params.custo !== undefined) {
      throw Error('Custo is not a number');
    }

    try {
      if (params.descricao) {
        return this.productRepository.find({
          where: { descricao: ILike(`%${params.descricao}%`) },
        });
      }
      return this.productRepository.find({ where: params });
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async findByPV(precoVenda: number) {
    if (isNaN(precoVenda) && precoVenda !== undefined) {
      throw Error('precoVenda is not a number');
    }

    const response = [] as Produto[];

    try {
      const products = await this.storeProductRepository.find({
        where: { precoVenda: precoVenda },
        order: { produto: { id: 'ASC' } },
        relations: ['produto'],
      });

      for (const prod of products) {
        const [prodResponse] = await this.productRepository.find({
          where: { id: prod?.produto.id },
        });

        response.push(prodResponse);
      }
      return response;
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
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
      if (error.code === '23505') {
        throw new Error(`Duplicated entry found`);
      }

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
