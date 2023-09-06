import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateStoreProductDto {
  @IsNumber()
  @IsOptional()
  precoVenda: number;

  @IsNumber()
  @IsNotEmpty()
  produtoId: number;

  @IsNumber()
  @IsNotEmpty()
  lojaId: number;
}
