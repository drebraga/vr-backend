import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ILike, Repository, Unique } from 'typeorm';
import { produto } from '../entity/produto.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(produto)
    private productRepository: Repository<produto>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
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
