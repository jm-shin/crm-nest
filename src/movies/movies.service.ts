import {Injectable, NotFoundException} from '@nestjs/common';
import {Movie} from "./entities/movie.entity";
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];

    getAll(): Movie[] {
        return this.movies;
    }

    getOne(id: number): Movie {
        const movie = this.movies.find((movies) => movies.id === id);
        if (!movie) {
            throw new NotFoundException(`Movie with ID: ${id} not found!`);
        }
        return movie;
    }

    deleteOne(id: number) {
        const movie = this.getOne(id);
        if (!movie) {
            throw new NotFoundException(`Movie with ID: ${id} not found!`);
        }
        this.movies = this.movies.filter((movie) => movie.id !== id);
    }

    create(movieData: CreateMovieDto){
        this.movies.push({
            id: this.movies.length + 1,
            ...movieData
        });
    }

    update(id: number, updateData: UpdateMovieDto) {
        const movie = this.getOne(id);
        if (!movie) {
            throw new NotFoundException(`Movie with ID: ${id} not found!`);
        }
        this.deleteOne(id);
        this.movies.push({...movie, ...updateData});
    }
}