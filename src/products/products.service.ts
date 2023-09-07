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
      const store = await this.storeRepository.findOne({
        where: { id: createProductDto.lojas[0].id },
      });
      if (!store) {
        throw new Error(
          `Store with ID ${createProductDto.lojas[0].id} not found`,
        );
      }

      const product = {
        descricao: createProductDto.descricao,
        custo: createProductDto.custo,
        imagem: createProductDto.imagem,
      };

      insertProduct = await this.productRepository.save(product);

      for (const store of createProductDto.lojas) {
        const createPricesResource = {
          produto: { id: +insertProduct.id },
          loja: { id: store.id },
          precoVenda: store.precoVenda,
        };
        console.log(createPricesResource);
        if (
          isNaN(createPricesResource.produto.id) ||
          createPricesResource.produto.id === null
        ) {
          throw Error('Product Id is NULL');
        }

        const newProductStore =
          this.storeProductRepository.create(createPricesResource);

        console.log(newProductStore);

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

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const productToUpdate = await this.productRepository.find({
        where: { id },
      });
      if (productToUpdate.length === 0) {
        throw new Error(`Product with ID ${id} not found`);
      }
      await this.productRepository.update({ id }, { ...updateProductDto });

      const [newProduct] = await this.findBy({ id });
      return newProduct;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
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
