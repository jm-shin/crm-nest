/*
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', function() {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should return a movie', function() {
      service.create({
        title: 'Test Movie Name',
        year: 2020,
        genres: ['test'],
      });
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it('should throw a NotFoundException', function() {
      try {
        service.getOne(999);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Movie with ID: 999 not found!');
      }
    });
  });

  describe('deleteOne', () => {
    it('delete a movie ', function() {
      service.create({
        title: 'Test Movie Name',
        year: 2020,
        genres: ['test'],
      });
      const beforeMovies = service.getAll().length;
      service.deleteOne(1);
      const afterMovies = service.getAll().length;
      expect(afterMovies).toBeLessThan(beforeMovies);
    });

    it('should throw a NotFoundException', function() {
      try {
        service.deleteOne(999);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Movie with ID: 999 not found!');
      }
    });
  });

  describe('create', () => {
    it('should create a movie', function() {
      const beforeCreate = service.getAll().length;
      service.create({
        title: 'Test Movie Name',
        year: 2020,
        genres: ['test'],
      });
      const afterCreate = service.getAll().length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a movie', function() {
      service.create({
        title: 'Test Movie Name',
        year: 2020,
        genres: ['test'],
      });
      const beforeMovie = service.getOne(1);

      service.update(1, {
        title: 'Updated Test Movie Name'
      });
      const afterMovie = service.getOne(1);

      expect(afterMovie.title).not.toEqual(beforeMovie.title);
      expect(afterMovie.title).toEqual('Updated Test Movie Name');
    });

    it('should throw a NotFoundException', function() {
      try {
        service.update(999, {});
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Movie with ID: 999 not found!');
      }
    });
  });
});
*/