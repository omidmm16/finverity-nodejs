import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { createReadStream } from 'fs';
import CustomFileInterceptor from 'src/utils/interceptors/custom.file.interceptor';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import ParamFileName from 'src/utils/paramFileName';
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'upload your image file ',
  })
  @UseInterceptors(
    CustomFileInterceptor({
      fieldName: 'file',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadfile(@UploadedFile() file: Express.Multer.File) {
    const uploadfile = await this.filesService.uploadFile(
      file.buffer,
      file.originalname,
    );
    return uploadfile;
  }
  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'return the list of name of uploaded file',
  })
  async getListOfFiles() {
    return await this.filesService.getListOfFiles();
  }
  @Get(':filename')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'return the image file based on name of requested file',
  })
  async getFile(
    @Query() { filename }: ParamFileName,
    @Res({ passthrough: true }) response: Response,
  ) {
    const stream = await this.filesService.getfile(filename);
    response.set({
      'Content-Type': 'image/png',
    });
    return new StreamableFile(stream);
  }
  @Delete(':filename')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Delete the file on the server based on name of requested file',
  })
  async deleteFile(@Query() { filename }: ParamFileName) {
    const deleteFile = await this.filesService.deleteFile(filename);
    return deleteFile;
  }
}
