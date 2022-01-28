import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductInfo } from '../productInfo.entity';

@Entity('st_subsc_per_product_day')
export class StSubscPerProductDayEntity {
  @Column({ name: 'stat_time' })
  statTime: string;

  @PrimaryGeneratedColumn({ name: 'product_group_id' })
  productGroupId: string;

  @Column({ name: 'total_count' })
  totalCount: number;

  @Column({ name: 'new_count' })
  newCount: number;

  @Column({ name: 'leave_count' })
  leaveCount: number;

  @ManyToOne(() => ProductInfo)
  @JoinColumn({name: 'product_group_id', referencedColumnName: 'productGroupId'})
  ProductInfo: ProductInfo;
}