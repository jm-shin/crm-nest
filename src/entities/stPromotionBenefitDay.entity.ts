import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class stPromotionBenefitDay {
  @Column()
  readonly stat_time: Date;

  @PrimaryGeneratedColumn()
  readonly promotion_id: string;

  @Column()
  readonly benefit_count: number;

  @Column()
  readonly current_count: number;

  @Column()
  readonly last_count: number;

  @Column()
  readonly is_first: number;
}