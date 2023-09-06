import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';

@Controller('store-products')
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductsService) {}

  @Post()
  create(@Body() createStoreProductDto: CreateStoreProductDto) {
    return this.storeProductsService.create(createStoreProductDto);
  }

  @Get(':id')
  async findAll(@Param('id') id: string) {
    return await this.storeProductsService.findAll(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoreProductDto: UpdateStoreProductDto,
  ) {
    return this.storeProductsService.update(+id, updateStoreProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeProductsService.remove(+id);
  }
}
