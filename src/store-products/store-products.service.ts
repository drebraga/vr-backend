import { Injectable } from '@nestjs/common';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { produtoloja } from '../entity/produtoloja.entity';
import { Repository } from 'typeorm';
import { loja } from '../entity/loja.entity';
import { Produto } from '../entity/produto.entity';

@Injectable()
export class StoreProductsService {
  constructor(
    @InjectRepository(produtoloja)
    private storeProductRepository: Repository<produtoloja>,
    @InjectRepository(loja)
    private storeRepository: Repository<loja>,
    @InjectRepository(Produto)
    private ProductRepository: Repository<Produto>,
  ) {}

  async create({ produtoId, lojaId, precoVenda }: CreateStoreProductDto) {
    try {
      const [product] = await this.ProductRepository.find({
        where: { id: produtoId },
      });
      if (!product) throw new Error(`Product with ID ${produtoId} not found`);

      const store = await this.storeRepository.findOne({
        where: { id: lojaId },
      });
      if (!store) throw new Error(`Store with ID ${lojaId} not found`);

      const storeProductExists = await this.findById(lojaId, produtoId);
      if (storeProductExists)
        throw new Error(
          `Product with ID ${produtoId} already with 
        cost in store ID ${lojaId}`,
        );
      const storeProduct = this.storeProductRepository.create({
        loja: { id: lojaId },
        produto: { id: produtoId },
        precoVenda,
      });
      return await this.storeProductRepository.save(storeProduct);
    } catch (error) {
      throw new Error(`Error creating product-store: ${error.message}`);
    }
  }

  async find(id: number) {
    try {
      const [produto] = await this.ProductRepository.find({ where: { id } });
      const lojas = await this.storeProductRepository.find({
        where: { produto: { id } },
        order: { loja: { id: 'ASC' } },
        relations: ['loja'],
        select: ['precoVenda'],
      });
      return {
        id: produto.id,
        descricao: produto.descricao,
        custo: produto.custo,
        imagem: produto.imagem ? produto.imagem.toString() : null,
        lojas,
      };
    } catch (error) {
      throw new Error(`Error finding product-store: ${error.message}`);
    }
  }

  findByCost(precoVenda: number) {
    try {
      return this.storeProductRepository.find({ where: { precoVenda } });
    } catch (error) {
      throw new Error(`Error finding product-store: ${error.message}`);
    }
  }

  findById(lojaId: number, produtoId: number) {
    try {
      return this.storeProductRepository.findOne({
        where: { loja: { id: lojaId }, produto: { id: produtoId } },
      });
    } catch (error) {
      throw new Error(`Error finding product-store: ${error.message}`);
    }
  }

  async update(
    id: number,
    { produtoId, lojaId, precoVenda }: UpdateStoreProductDto,
  ) {
    try {
      const productToUpdate = await this.storeProductRepository.findOne({
        where: {
          id,
        },
      });
      const storeProductExists = await this.storeProductRepository.findOne({
        where: {
          loja: { id: lojaId },
          produto: { id: produtoId },
        },
      });
      if (!productToUpdate)
        throw new Error(`Product-Store with ID ${id} not found`);

      if (storeProductExists && productToUpdate.id !== storeProductExists?.id)
        throw new Error(`Product with ID ${produtoId} already with 
        cost in store ID ${lojaId}`);

      await this.storeProductRepository.update(
        { id },
        {
          ...{ loja: { id: lojaId }, produto: { id: produtoId }, precoVenda },
        },
      );
      return { id };
    } catch (error) {
      throw new Error(`Error updating product-store: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const storeProductToRemove = await this.storeProductRepository.findOne({
        where: {
          id,
        },
      });
      if (!storeProductToRemove)
        throw new Error(`Product-Store with ID ${id} not found`);
      return this.storeProductRepository.remove(storeProductToRemove);
    } catch (error) {
      throw new Error(`Error removing product-store: ${error.message}`);
    }
  }
}
