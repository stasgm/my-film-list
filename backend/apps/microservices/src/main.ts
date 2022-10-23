import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RedisIoAdapter } from '../../server/src/middlewares/redis-io.adapter.middleware';
import { MicroservicesModule } from './microservices.module';

async function bootstrap() {
  const app = await NestFactory.create(MicroservicesModule);

  app.useWebSocketAdapter(new RedisIoAdapter(app));

  await app.listen(3002, () => {
    Logger.log(`Running Microservices in ${process.env.NODE_ENV || 'development'} environment', 'Microservice`);
  });
}
bootstrap();
