import { AuthModule } from './auth/auth.module';
import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AppService } from './app.service';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PromotionController } from './promotion/promotion.controller';
import { PromotionService } from './promotion/promotion.service';
import { PromotionModule } from './promotion/promotion.module';

const transports = {
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike('CRM 2.0'),
  ),
  transports: [
    new winston.transports.Console(),
    new (require('winston-daily-rotate-file'))({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      dirname: './logs',
      filename: '%DATE%.log',
      datePattern: 'YYYY-MM-DD'
    }),
    /*
    new winston.transports.File({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      dirname: './logs',
      filename: 'info.log',
    }),
     */
  ],
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    WinstonModule.forRoot(transports),
    MoviesModule,
    UsersModule,
    AuthModule,
    PromotionModule
  ],
  controllers: [AppController, UsersController, PromotionController],
  providers: [AppService, UsersService, PromotionService],
})

export class AppModule implements NestModule {
  constructor(private connection: Connection) {
  }
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}