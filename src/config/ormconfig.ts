import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const defaultOrmConfig: MysqlConnectionOptions = {
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
};

export const externalOrmConfig: MysqlConnectionOptions = {
  name: 'stats',
  type: 'mysql',
  host: process.env.EX_DB_HOST,
  port: 9306,
  username: process.env.EX_DB_USER,
  password: process.env.EX_DB_PASS,
  database: process.env.EX_DB_NAME,
  entities: [
    'dist/model/entities/external/*.entity{.ts,.js}',
  ],
  synchronize: false,
  connectTimeout: 10000,
  logging: true,
};