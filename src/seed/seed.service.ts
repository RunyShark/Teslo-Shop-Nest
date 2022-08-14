import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '../product/product.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    private readonly productServices: ProductService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productServices.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });

    const debeUser = await this.userRepository.save(seedUsers);
    return debeUser[0];
  }

  private async insertNewProducts(user: User) {
    await this.productServices.deleteAllProducts();

    const productos = initialData.products;

    const insertPromises = [];

    productos.forEach((product) => {
      insertPromises.push(this.productServices.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
