import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoductImage, Product } from './entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, PoductImage]), AuthModule],
  exports: [ProductService],
})
export class ProductModule {}
