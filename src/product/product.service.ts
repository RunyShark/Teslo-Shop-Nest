import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import {
  DataSource,
  Repository,
  ReturningStatementNotSupportedError,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, PoductImage } from './entities';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductService {
  private readonly logger = new Logger('ProductService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(PoductImage)
    private readonly producImagetRepository: Repository<PoductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { image = [], ...producDetails } = createProductDto;

    const product = this.productRepository.create({
      ...producDetails,
      image: image.map((image) =>
        this.producImagetRepository.create({ url: image }),
      ),
    });
    try {
      await this.productRepository.save(product);

      return { ...product, image };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          image: true,
        },
      });

      if (!products) throw new NotFoundException(`Not found products`);

      return products.map(({ image, ...res }) => ({
        ...res,
        image: image.map((img) => img.url),
      }));
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product;
    try {
      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({
          id: term,
        });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        product = await queryBuilder
          .where(`UPPER(title)=:title or slug=:slug`, {
            title: term.toUpperCase(),
            slug: term.toLowerCase(),
          })
          .leftJoinAndSelect('prod.image', 'prodImages')
          .getOne();
      }

      if (!product) throw new NotFoundException(`Product not found`);

      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOnePlain(term: string) {
    const { image = [], ...res } = await this.findOne(term);
    return {
      ...res,
      image: image.map((img) => img.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { image, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (image) {
        await queryRunner.manager.delete(PoductImage, { product: { id } });

        product.image = image.map((img) =>
          this.producImagetRepository.create({ url: img }),
        );
      } else {
      }
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { ...product, image };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      if (!product) throw new NotFoundException(`Product not found`);
      await this.productRepository.remove(product);
      return 'ok';
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    //console.log(error);
    if (error.response) throw new BadRequestException(error.message);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.code === '23502') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
