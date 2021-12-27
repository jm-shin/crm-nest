import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PromotionReceiverInfo } from '../../promotion/entities/promotionReceiverInfo.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    idx: number;

    @PrimaryColumn({name:'user_id'})
    userId: string;

    @Column({name: 'user_name'})
    userName: string;

    @Column()
    password: string;

    @Column()
    pre_password_3month: string;

    @Column()
    pre_password_6month: string;

    @Column()
    op_class: number;

    @Column()
    mobile: string;

    @Column()
    email: string;

    @Column()
    department: string;

    @Column()
    app_id: string;

    @Column()
    uno: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    @Column()
    password_update_at: Date;

    @Column()
    login_fail_count: number;

    @Column()
    valid_state: number;

    @Column()
    send_alert: number;

    @Column()
    download: number;

    @OneToMany(() => PromotionReceiverInfo, (receiverInfo) => receiverInfo.User)
    ReceiverInfo: PromotionReceiverInfo[];
}