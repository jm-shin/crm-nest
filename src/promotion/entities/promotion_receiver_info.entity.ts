import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PromotionReceiverInfo {
    @PrimaryColumn()
    receiver_id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    user_idx: number;

    @Column()
    group_no: number;

    @Column()
    condition_text: string;

    @Column()
    condition_json: string;

    @Column()
    valid_state: number;
}