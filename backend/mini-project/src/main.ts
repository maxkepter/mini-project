/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Exam Management API')
    .setDescription('The Exam Management API documentation')
    .setVersion('1.0')
    .build();

  const documentation = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentation);

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/swagger-json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(documentation);
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
