import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class stPromotionBenefitDay {
  @Column({ name: 'stat_time' })
  readonly statTime: Date;

  @PrimaryGeneratedColumn({ name: 'promotion_id' })
  readonly promotionId: string;

  @Column({ name: 'title' })
  readonly title: string;

  @Column({ name: 'benefit_count' })
  readonly benefitCount: number;

  @Column({ name: 'current_count' })
  readonly currentCount: number;

  @Column({ name: 'last_count' })
  readonly lastCount: number;

  @Column({ name: 'is_first' })
  readonly isFirst: number;
}