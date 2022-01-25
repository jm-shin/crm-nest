import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StPromotionMaintainMon {
  @Column({ name: 'stat_time' })
  readonly statTime: string;

  @PrimaryGeneratedColumn({ name: 'promotion_id' })
  readonly promotionId: string;

  @Column({ name: 'start_mon' })
  readonly startMon: string;

  @Column({ name: 'init_count' })
  readonly initCount: number;

  @Column({ name: 'current_count' })
  readonly currentCount: number;
}