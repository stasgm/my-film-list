import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { writeFileSync } from 'fs';
import path from 'path';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './middlewares/redis-io.adapter.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy');
  app.use(cookieParser());
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  app.useWebSocketAdapter(new RedisIoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('MyFilmsList')
    .setDescription('MyFilmsList API')
    .setVersion('1.17.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .addServer('/api')
    .build();

  const apiDocumentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const apiDocument = SwaggerModule.createDocument(app, config, apiDocumentOptions);

  SwaggerModule.setup('doc', app, apiDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'MyFilmsList API Documentation',
  });

  await app.listen(3001, () => {
    if (process.env.NODE_ENV == 'development') {
      // Generate API Documentation only in development mode
      const outputPath = path.resolve(process.cwd(), 'myfilms-openapi-specs.json');
      writeFileSync(outputPath, JSON.stringify(apiDocument), { encoding: 'utf8' });
    }

    Logger.log(`Running MyFilmsList Server in ${process.env.NODE_ENV || "development"} environment`, 'FilmsServer');
  });
}
bootstrap();
