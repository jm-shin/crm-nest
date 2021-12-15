import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  private readonly logger = new Logger(MoviesService.name);

  getAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  getOne(id: number): Promise<Movie> {
    const movie = this.movieRepository.findOne({ id: id });
    this.logger.log(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID: ${id} not found!`);
    }
    return movie;
  }

  async deleteOne(id: number): Promise<void> {
    const movie = this.getOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID: ${id} not found!`);
    }
    await this.movieRepository.delete({ id: id });
  }

  async create(movieData: CreateMovieDto) {
    await this.movieRepository.save(movieData);
  }

  update(id: number, updateData: UpdateMovieDto) {
    const movie = this.getOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID: ${id} not found!`);
    }
    return this.movieRepository.update({ id: id }, updateData);
  }
}