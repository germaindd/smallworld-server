import * as Joi from 'joi';
import { Stages } from './stages.enum';

export enum ConfigKeys {
  PORT = 'PORT',
  STAGE = 'STAGE',
  DATABASE_URL = 'DATABASE_URL',
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_DATABASE = 'DB_DATABASE',
  ACCESS_TOKEN_SECRET = 'ACCESS_TOKEN_SECRET',
  REFRESH_TOKEN_SECRET = 'REFRESH_TOKEN_SECRET',
  REFRESH_TOKEN_EXPIRY_DAYS = 'REFRESH_TOKEN_EXPIRY_DAYS',
  ACCESS_TOKEN_EXPIRY_MINUTES = 'ACCESS_TOKEN_EXPIRY_MINUTES',
}
const requiredWhen = (stage: Stages, schema: Joi.Schema) =>
  Joi.when(ConfigKeys.STAGE, {
    is: stage,
    then: schema.required(),
    otherwise: Joi.forbidden(),
  });

export const configValidationSchema = Joi.object({
  [ConfigKeys.PORT]: Joi.number().required(),
  [ConfigKeys.STAGE]: Joi.string().required(),
  [ConfigKeys.DATABASE_URL]: requiredWhen(Stages.DEV, Joi.string()),
  [ConfigKeys.DB_HOST]: requiredWhen(Stages.LOCAL, Joi.string()),
  [ConfigKeys.DB_PORT]: requiredWhen(Stages.LOCAL, Joi.number()),
  [ConfigKeys.DB_USERNAME]: requiredWhen(Stages.LOCAL, Joi.string()),
  [ConfigKeys.DB_PASSWORD]: requiredWhen(Stages.LOCAL, Joi.string()),
  [ConfigKeys.DB_DATABASE]: requiredWhen(Stages.LOCAL, Joi.string()),
  [ConfigKeys.ACCESS_TOKEN_SECRET]: Joi.string().required(),
  [ConfigKeys.REFRESH_TOKEN_SECRET]: Joi.string().required(),
  [ConfigKeys.REFRESH_TOKEN_EXPIRY_DAYS]: Joi.number().required(),
  [ConfigKeys.ACCESS_TOKEN_EXPIRY_MINUTES]: Joi.number().required(),
});
