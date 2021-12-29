import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
//winston
import  *  as  winston  from  'winston';

const transport = new (require('winston-daily-rotate-file'))({
  filename: 'API.%DATE%.log',
  dirname: './logs/API',
  datePattern: 'MMDD',
  zippedArchive: true,
  prettyPrint: true,
  maxSize: '10m',
  maxFiles: '7d',
  symlinkName: 'API.log',
});

const winstonLogger = winston.createLogger({
  transports: [
    transport
  ],
});

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} [${statusCode}] ${contentLength} - ${userAgent} ${ip} (authorization: ${req.header('Authorization')}) - ${JSON.stringify(req.body)}`,
      );
      winstonLogger.info(`${method} ${originalUrl} [${statusCode}] ${contentLength} - ${userAgent} ${ip} (authorization: ${req.header('Authorization')}) - ${JSON.stringify(req.body)}`);
    });
    next();
  }
}