import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Min(3)
  @Max(50)
  title: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @IsString()
  @IsOptional()
  @Min(3)
  @Max(150)
  description?: string;

  @IsString()
  slug: string;

  @IsNumber()
  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;

  @IsString()
  gender: string;
}
