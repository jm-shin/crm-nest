import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    year: number;

    @Column()
    genres: string;
}