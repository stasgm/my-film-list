import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

export const immichAppConfig: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().required().valid('development', 'production', 'staging').default('development'),
    MONGO_URI: Joi.string().required()
  }),
};
