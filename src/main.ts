import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './config/exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: ['http://localhost:3001'],
  });

  const config = new DocumentBuilder()
    .setTitle('Finelunch')
    .setDescription('Finelunch API description')
    .setVersion('1.0')
    .addTag('Finelunch')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-ui', app, document);

  await app.listen(9000);
}
bootstrap();
