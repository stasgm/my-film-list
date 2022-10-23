import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { immichAppConfig } from './config/app.config';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@app/database';
import { AppLoggerMiddleware } from './middlewares/app-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(immichAppConfig),
    DatabaseModule,
    BullModule.forRootAsync({
      useFactory: async () => ({
        prefix: 'films_bull',
        redis: {
          host: process.env.REDIS_HOSTNAME || 'films_redis',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          db: parseInt(process.env.REDIS_DBINDEX || '0'),
          password: process.env.REDIS_PASSWORD || undefined,
          path: process.env.REDIS_SOCKET || undefined,
        },
      }),
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule implements NestModule {
  // TODO: check if consumer is needed or remove
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(consumer: MiddlewareConsumer): void {
    if (process.env.NODE_ENV == 'development') {
      // consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
  }
}
