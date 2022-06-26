import * as Joi from 'joi';

export default Joi.object({
  APP_NAME: Joi.string().default('n/a'),
  APP_ENV: Joi.string()
    .valid('development', 'production')
    .default('production'),

  APP_URL: Joi.string().default('http://localhost:3000'),
  PORT: Joi.number().default(9000),
  API_VERSION: Joi.string().required(),
  API_PREFIX: Joi.string().required().regex(/^v/),
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
  DIMENSION_SIZE_UPLOADED_IMAGE: Joi.string()
    .required()
    .valid('large', 'medium', 'thumb')
    .default('medium'),
  UPLOAD_FILE_SIZE: Joi.number().required().default(Math.pow(2048, 2)),
});
