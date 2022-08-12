import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';

@Injectable()
export class SeedService {
  constructor(private readonly productServices: ProductService) {}
  async runSeed() {
    await this.insertNewProducts();
    return 'This action adds a new seed';
  }

  private async insertNewProducts() {
    await this.productServices.deleteAllProducts();
    return true;
  }
}
