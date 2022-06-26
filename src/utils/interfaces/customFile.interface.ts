import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export default interface CustomFileInerceptorOptions {
  fieldName?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}
