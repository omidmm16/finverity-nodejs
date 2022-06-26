import { createReadStream } from 'fs';
import { DimensionImageSize } from './interfaces/dimension.image.interface';
import { HttpException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AppConfigService } from '../config/app.config.service';
import dimensionSize = require('./dimension.size.json');
import * as sharp from 'sharp';
@Injectable()
export class FilesService {
  constructor(private readonly appConfigService: AppConfigService) {}
  async uploadFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.appConfigService.get('app.aws_public_bucket_name'),
        Body: await this.changeDemension(dataBuffer),
        Key: `${filename}`,
      })
      .promise();
    console.log(uploadResult);
    return uploadResult;
  }
  async selectDimensionSize(): Promise<DimensionImageSize> {
    const getActiveDimension = this.appConfigService.get(
      'app.demension_size_uploaded_image',
    );
    return dimensionSize[getActiveDimension];
  }
  async changeDemension(databuffer: Buffer): Promise<Buffer> {
    const dimensionSize = await this.selectDimensionSize();
    const changedImage = await sharp(databuffer)
      .resize(dimensionSize.width, dimensionSize.height)
      .toBuffer();
    return changedImage;
  }

  async getListOfFiles(): Promise<Array<string>> {
    const s3 = new S3();
    const data = await s3
      .listObjectsV2({
        Bucket: this.appConfigService.get('app.aws_public_bucket_name'),
        Delimiter: '/',
      })
      .promise();
    const filesName = data.Contents.map((file) => {
      return file.Key;
    });
    return filesName;
  }
  async getfile(filename: string) {
    const s3 = new S3();
    try {
      await s3
        .headObject({
          Bucket: this.appConfigService.get('app.aws_public_bucket_name'),
          Key: filename,
        })
        .promise();
    } catch (err) {
      throw new HttpException(err, 404);
    }

    const stream = s3
      .getObject({
        Bucket: this.appConfigService.get('app.aws_public_bucket_name'),
        Key: filename,
      })
      .createReadStream();
    return stream;
  }

  async deleteFile(filename: string) {
    const s3 = new S3();
    const res = await s3
      .deleteObject({
        Bucket: this.appConfigService.get('app.aws_public_bucket_name'),
        Key: filename,
      })
      .promise();
    return res;
  }
}
