import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  STAGE: Joi.string().default('local')
});
