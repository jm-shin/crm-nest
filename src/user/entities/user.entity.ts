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

    @Column({name: 'pre_password_3month'})
    prePassword3month: string;

    @Column({name:'pre_password_6month'})
    prePassword6month: string;

    @Column({name:'op_class'})
    opClass: number;

    @Column()
    mobile: string;

    @Column()
    email: string;

    @Column()
    department: string;

    @Column({name: 'app_id'})
    appId: string;

    @Column()
    uno: string;

    @Column({name: 'created_at'})
    createdAt: Date;

    @Column({name: 'updated_at'})
    updatedAt: Date;

    @Column({name: 'password_update_at'})
    passwordUpdateAt: Date;

    @Column({name: 'login_fail_count'})
    loginFailCount: number;

    @Column({name: 'valid_state'})
    validState: number;

    @Column({name: 'send_alert'})
    sendAlert: number;

    @Column()
    download: number;

    @OneToMany(() => PromotionReceiverInfo, (receiverInfo) => receiverInfo.User)
    ReceiverInfo: PromotionReceiverInfo[];
}