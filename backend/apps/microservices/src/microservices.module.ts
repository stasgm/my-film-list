import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseModule } from '@app/database';
import { UserSchema } from '@app/database/entities/user.entity';
import { userActivationQueueName } from '@app/job/constants/queue-name.constant';

import { MicroservicesService } from './microservices.service';
import { UserActivationProcessor } from './processors/user-activation.processor';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    BullModule.forRootAsync({
      useFactory: async () => ({
        redis: {
          host: process.env.REDIS_HOSTNAME || 'films_redis',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          db: parseInt(process.env.REDIS_DBINDEX || '0'),
          password: process.env.REDIS_PASSWORD || undefined,
          path: process.env.REDIS_SOCKET || undefined,
        },
      }),
    }),
    BullModule.registerQueue({
      name: userActivationQueueName,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  controllers: [],
  providers: [
    MicroservicesService,
    UserActivationProcessor,
  ],
  exports: [],
})
export class MicroservicesModule {}
