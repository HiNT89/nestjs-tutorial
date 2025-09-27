import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const initSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(configService.get('TITLE') || 'NestJS API')
    .setDescription(configService.get('DESCRIPTION') || 'API Documentation')
    .setVersion(configService.get('VERSION') || '1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('DOCS') || 'docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
    },
  });
};

export default initSwagger;
