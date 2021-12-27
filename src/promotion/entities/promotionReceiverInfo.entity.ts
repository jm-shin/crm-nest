import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class PromotionReceiverInfo {
    @PrimaryGeneratedColumn({name: 'receiver_id'}) //자동생성
    receiverId: number;

    @Column('varchar', {name: 'title'})
    title: string;

    @Column()
    description: string;

    @Column({name: 'user_idx'})
    userIdx: number;

    @Column({name: 'group_no'})
    groupNo: number;

    @Column({name: 'condition_text'})
    conditionText: string;

    @Column({name: 'condition_json'})
    conditionJson: string;

    @Column({name:'valid_state'})
    validState: number;

    @Column('timestamp',{ name: 'created_at', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column('timestamp', { name: 'updated_at', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    // @ManyToOne(() => User, (user) => user.ReceiverInfo)
    @ManyToOne(() => User)
    @JoinColumn({name:'user_idx', referencedColumnName: 'idx'}) //필요한 쪽에 하나만
    User: User;
}