import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn()
    idx: number;

    @PrimaryColumn()
    user_id: string;

    @Column()
    user_name: string;

    @Column()
    password: string;
}