import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(60)
  descricao: string;

  @IsNumber()
  @IsOptional()
  custo: number;

  @IsString()
  @IsOptional()
  imagem: string;
}
