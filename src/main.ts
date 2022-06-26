import { AppConfigService } from './config/app.config.service';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'aws-sdk';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const appConfigService = app.get(AppConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = appConfigService.getNumber('app.port');
  const apiPrefix = appConfigService.get('app.apiPrefix');
  config.update({
    accessKeyId: appConfigService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: appConfigService.get('AWS_SECRET_ACCESS_KEY'),
    region: appConfigService.get('AWS_REGION'),
  });
  app.setGlobalPrefix(apiPrefix);
  if (!appConfigService.isProduction) {
    setupSwagger(app, apiPrefix);
  }
  await app.listen(port);
  console.log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
