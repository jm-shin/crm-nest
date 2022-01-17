import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PromotionReceiverGroupInfo {

  @PrimaryGeneratedColumn({name: 'group_id'})
  groupId: number;

  @Column()
  title: string;

  @Column({name: 'user_idx'})
  userIdx: number;

  @Column({name: 'uno_count'})
  unoCount: number;

  @Column({name: 'uno_list'})
  unoList: string;

  @Column({name:'valid_state'})
  validState: number;

  @Column('timestamp',{ name: 'created_at', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @Column({name: 'group_no'})
  groupNo: number;

  @ManyToOne(() => User)
  @JoinColumn({name:'user_idx', referencedColumnName: 'idx'})
  User: User;
}