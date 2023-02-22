import * as Joi from 'joi';

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

export const configValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  STAGE: Joi.string().required(),
  DATABASE_URL: Joi.string().optional(),
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().optional(),
  DB_USERNAME: Joi.string().optional(),
  DB_PASSWORD: Joi.string().optional(),
  DB_DATABASE: Joi.string().optional(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRY_DAYS: Joi.number().required(),
  ACCESS_TOKEN_EXPIRY_MINUTES: Joi.number().required(),
});
