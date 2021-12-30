import { AuthModule } from './auth/auth.module';
import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { LoggerMiddleware } from './middleware/logger.middleware';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { UserService } from './api/user/user.service';
import { UserController } from './api/user/user.controller';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ReceiverController } from './api/promotion/receiver/receiver.controller';
import { ReceiverService } from './api/promotion/receiver/receiver.service';
import { ReceiverModule } from './api/promotion/receiver/receiver.module';

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
      datePattern: 'YYYY-MM-DD',
    }),
  ],
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    WinstonModule.forRoot(transports),
    UserModule,
    AuthModule,
    ReceiverModule,
  ],
  controllers: [UserController, ReceiverController],
  providers: [UserService, ReceiverService],
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