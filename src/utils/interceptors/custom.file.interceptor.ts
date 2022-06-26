import { promisify } from 'util';
import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import CustomFileInerceptorOptions from '../interfaces/customFile.interface';

function CustomFileInterceptor(
  options: CustomFileInerceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const limitSize: number = configService.get<number>(
        'app.upload_file_size',
      );

      const multerOptions: MulterOptions = {
        fileFilter: options.fileFilter,
        limits: {
          fileSize: Number(limitSize),
        },
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default CustomFileInterceptor;
