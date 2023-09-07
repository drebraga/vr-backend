import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStoreProductDto {
  @IsNumber()
  @IsNotEmpty()
  precoVenda: number;

  @IsNumber()
  @IsNotEmpty()
  produtoId: number;

  @IsNumber()
  @IsNotEmpty()
  lojaId: number;
}
