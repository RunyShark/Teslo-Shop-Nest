import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(150)
  description?: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  size: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;
}
