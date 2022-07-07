import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const transport = new (require('winston-daily-rotate-file'))({
  filename: 'API.%DATE%.log',
  dirname: './logs/API',
  datePattern: 'MMDD',
  zippedArchive: false,
  prettyPrint: true,
  maxSize: '10m',
  maxFiles: '365d',
  showLevel: true,
  createSymlink: true,
  symlinkName: 'API.log',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('HTTP', { prettyPrint: true }),
  ),
});

const winstonLogger = winston.createLogger({
  transports: [
    transport,
  ],
});

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const authToke = req.header('Authorization');

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const body = JSON.stringify(req.body);
      /*
      //log 분리
      this.logger.log(
        `${method} ${originalUrl} [${statusCode}] ${contentLength} - ${userAgent} ${ip} (authorization: ${authToke}) - ${body}`,
      );
       */
      winstonLogger.info(`${method} ${originalUrl} [${statusCode}] ${contentLength} - ${userAgent} ${ip} (authorization: ${authToke}) - ${body}`);
    });
    next();
  }
}