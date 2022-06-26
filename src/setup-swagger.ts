import { AppConfigService } from './config/app.config.service';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, apiPrefix: string): void {
  const appConfigService = app.get(AppConfigService);
  const appName = appConfigService.get('app.name');
  const apiVersion = appConfigService.get('app.apiVersion');
  const appUrl = appConfigService.get('app.url');
  const options = new DocumentBuilder()
    .setTitle(appName)
    .setVersion(apiVersion)
    .setExternalDoc('API JSON', `${appUrl}/doc-json`)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${apiPrefix}/doc`, app, document, {
    swaggerUrl: `hostDomain/api/docs-json`,
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });
}
