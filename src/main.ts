import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import initSwagger from './swagger/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Get ConfigService instance
  const configService = app.get(ConfigService);

  // Initialize Swagger documentation
  initSwagger(app);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  const docsPath = configService.get('DOCS') || 'docs';
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/${docsPath}`);
}
bootstrap();
