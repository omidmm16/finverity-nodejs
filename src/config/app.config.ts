import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  app_name: process.env.APP_NAME,
  port: process.env.PORT,
  env: process.env.APP_ENV,
  url: process.env.APP_URL,
  apiVersion: process.env.API_VERSION,
  apiPrefix: process.env.API_PREFIX,

  aws_region: process.env.AWS_REGION,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_public_bucket_name: process.env.AWS_PUBLIC_BUCKET_NAME,
  demension_size_uploaded_image: process.env.DIMENSION_SIZE_UPLOADED_IMAGE,
  upload_file_size: process.env.UPLOAD_FILE_SIZE,
}));
