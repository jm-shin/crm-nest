import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggerMiddleware } from './middleware/logger.middleware';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ReceiverModule } from './api/promotion/receiver/receiver.module';
import { GroupModule } from './api/promotion/group/group.module';
import { ManagementModule } from './api/promotion/management/management.module';
import { StatsModule } from './api/promotion/stats/stats.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

const transports = {
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike('CRM 2.0'),
  ),
  transports: [
    new winston.transports.Console(),
    new (require('winston-daily-rotate-file'))({
      level: process.env.LEVEL === 'production' ? 'info' : 'debug',
      dirname: './logs',
      filename: 'PROM.%DATE%.log',
      datePattern: 'MMDD',
      prettyPrint: true,
      maxSize: '10m',
      maxFiles: '7d',
      showLevel: true,
      createSymlink: true,
      symlinkName: 'PROM.log',
    }),
  ],
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        'dist/entities/*.entity{.ts,.js}',
      ],
      synchronize: false,
      connectTimeout: 10000,
      logging: true,
    }),
    TypeOrmModule.forRoot({
      name: 'stats',
      type: 'mysql',
      host: process.env.EX_DB_HOST,
      port: 9306,
      username: process.env.EX_DB_USER,
      password: process.env.EX_DB_PASS,
      database: process.env.EX_DB_NAME,
      entities: [
        'dist/entities/*.entity{.ts,.js}',
      ],
      synchronize: false,
      connectTimeout: 10000,
      logging: true,
    }),
    WinstonModule.forRoot(transports),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    ReceiverModule,
    GroupModule,
    ManagementModule,
    StatsModule,
  ],
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