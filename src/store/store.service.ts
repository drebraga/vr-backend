import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { loja } from '../entity/loja.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(loja) private StoreRepository: Repository<loja>,
  ) {}

  findAll() {
    try {
      return this.StoreRepository.find();
    } catch (error) {
      throw new Error(`Error getting stores: ${error.message}`);
    }
  }

  findOne(id: number) {
    try {
      return this.StoreRepository.find({ where: { id } });
    } catch (error) {
      throw new Error(`Error getting store: ${error.message}`);
    }
  }
}
