import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDTO {
  @IsInt()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsInt()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  offset?: number;
}
