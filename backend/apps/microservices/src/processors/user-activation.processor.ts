import { Model } from 'mongoose';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '@app/database/entities/user.entity';
import { Logger } from '@nestjs/common';

import {
  IUserActivationJob,
  userActivationProcessorName,
  userActivationQueueName
} from '@app/job';

@Processor(userActivationProcessorName)
export class UserActivationProcessor {
  constructor(
    @InjectModel("UserEntity")
    private userRepository: Model<UserDocument>,
  ) {}

  /**
   * @param job user-activation
   */
  @Process(userActivationProcessorName)
  async processRegistredUser(job: Job<IUserActivationJob>) {
    const { user } = job.data;

    // Sending confirmation by email
    await this.userRepository.findByIdAndUpdate(user.id, { activated: true });
    Logger.log(`User with ID ${user.id} was activated`, 'userActivation');
    // TODO Error handler
  }
}
