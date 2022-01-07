import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { LoggerMiddleware } from './middleware/logger.middleware';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ReceiverModule } from './api/promotion/receiver/receiver.module';
import { GroupModule } from './api/promotion/group/group.module';
import { ManagementController } from './api/promotion/management/management.controller';
import { ManagementService } from './api/promotion/management/management.service';
import { ManagementModule } from './api/promotion/management/management.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatsController } from './api/promotion/stats/stats.controller';
import { StatsService } from './api/promotion/stats/stats.service';
import { StatsModule } from './api/promotion/stats/stats.module';

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
      filename: 'PROM.%DATE%.log',
      datePattern: 'MMDD',
      prettyPrint: true,
      maxSize: '10m',
      maxFiles: '7d',
      showLevel: true,
      createSymlink: true,
      symlinkName: 'PROM.log'
    }),
  ],
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    WinstonModule.forRoot(transports),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    ReceiverModule,
    GroupModule,
    ManagementModule,
    StatsModule,
  ],
  controllers: [ManagementController, StatsController],
  providers: [ManagementService, StatsService]
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