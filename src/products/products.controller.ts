import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findBy({ id: +id });
  }

  @Get('descricao/:descricao')
  findByDescription(@Param('descricao') descricao: string) {
    return this.productsService.findBy({ descricao });
  }

  @Get('custo/:custo')
  findByCost(@Param('custo') custo: string) {
    return this.productsService.findBy({ custo: +custo });
  }

  @Get('precovenda/:precovenda')
  findByPV(@Param('precovenda') precoVenda: string) {
    return this.productsService.findByPV(+precoVenda);
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
