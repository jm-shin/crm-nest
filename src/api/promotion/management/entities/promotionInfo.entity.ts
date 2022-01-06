import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Entity()
export class PromotionInfo {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ name: 'promotion_id' })
  promotionId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: 'user_idx' })
  userIdx: number;

  @Column({name: 'receiver_id'})
  receiverId: number;

  @Column({ name: 'group_no' })
  groupNo: number;

  @Column({ name: 'condition_json' })
  conditionJson: string;

  @Column({name: 'progress_state'})
  progressState: number;

  @Column('timestamp', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'valid_state' })
  validState: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_idx', referencedColumnName: 'idx' })
  User: User;
}