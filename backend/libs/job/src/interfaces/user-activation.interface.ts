import { UserEntity } from '@app/database/entities/user.entity';

export interface IUserActivationJob {
  /**
   * The User entity that was registred in the database
   */
  user: UserEntity;
}
