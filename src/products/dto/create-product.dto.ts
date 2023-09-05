import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  descricao: string;

  @IsNumber()
  @IsOptional()
  custo: number;

  @IsString()
  @IsOptional()
  imagem: string;
}
