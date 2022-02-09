import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_info')
export class ProductInfoEntity {
  @PrimaryGeneratedColumn({ name: 'idx' })
  idx: number;

  @Column({ name: 'product_group_id' })
  productGroupId: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'created_at' })
  createdAt: string;

  @Column({ name: 'updated_at' })
  updatedAt: string;
}