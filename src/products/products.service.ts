import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ILike, Repository } from 'typeorm';
import { produto } from '../entity/produto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(produto)
    private productRepository: Repository<produto>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ order: { id: 'ASC' } });
  }

  findOne(params: { id?: number; descricao?: string; custo?: number }) {
    if (params.descricao) {
      return this.productRepository.find({
        where: { descricao: ILike(`%${params.descricao}%`) },
      });
    }
    return this.productRepository.find({ where: params });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productToUpdate = await this.productRepository.find({
      where: { id },
    });
    if (productToUpdate) {
      await this.productRepository.update({ id }, { ...updateProductDto });
    } else {
      throw new Error(`Product with ID ${id} not found`);
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
