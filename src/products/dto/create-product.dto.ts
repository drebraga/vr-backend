import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Max,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  descricao: string;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Max(9999999999.999)
  @IsOptional()
  custo: number;

  @IsString()
  @IsOptional()
  imagem: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => lojaDto)
  lojas: lojaDto[];
}

export class lojaDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Max(9999999999.999)
  @IsNotEmpty()
  precoVenda: number;
}
