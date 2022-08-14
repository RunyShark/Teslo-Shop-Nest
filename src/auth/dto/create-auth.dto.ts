import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3, { message: 'Debe de tener por lo menos 3 caracteres' })
  @MaxLength(30, { message: 'Debe de tener menos de 30 caracteres' })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  fullName: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  roles?: string[];
}
