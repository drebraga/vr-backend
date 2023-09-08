import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  findBy(
    @Query('id') id: string,
    @Query('descricao') descricao: string,
    @Query('custo') custo: string,
    @Query('precoVenda') precoVenda: string,
  ) {
    return this.productsService.search({
      id: +id,
      descricao,
      custo: +custo,
      precoVenda: +precoVenda,
    });
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
