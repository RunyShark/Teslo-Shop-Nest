import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productServices: ProductService) {}
  async runSeed() {
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    await this.productServices.deleteAllProducts();

    const productos = initialData.products;

    const insertPromises = [];

    productos.forEach((product) => {
      insertPromises.push(this.productServices.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
