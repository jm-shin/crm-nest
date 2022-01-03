import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { setSwagger } from './common/utils/swagger';

async function bootstrap() {
  const port = process.env.PORT || 4300;
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  setSwagger(app);
  await app.listen(port).then(() => console.info(`server listening on port:${port}`));
}

bootstrap();