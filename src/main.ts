import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { setSwagger } from './common/utils/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';

declare const module: any;

async function bootstrap() {
  const port = process.env.PORT || 4300;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    // transformOptions: {enableImplicitConversion: true}
  }));
  app.useStaticAssets(path.join(__dirname, '..', 'upload/image'), { prefix: '/api/promotion/imgurl/' });
  setSwagger(app);
  await app.listen(port).then(() => console.info(`server listening on port:${port}`));
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();