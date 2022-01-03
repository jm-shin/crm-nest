//swagger
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('CRM')
    .setDescription('CRM NEST API')
    .setVersion('2.0')
    .addBearerAuth({
        type: 'http', scheme: 'bearer', bearerFormat: 'Token',
      },
      'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}