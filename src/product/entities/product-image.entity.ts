import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';
@Entity()
export class PoductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => Product, (product) => product.image, { onDelete: 'CASCADE' })
  product: Product;
}
