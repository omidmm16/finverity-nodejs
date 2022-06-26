import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}
  public get isProduction(): boolean {
    return this.get('app.env') === 'production';
  }

  public get(key: string): string {
    return this.configService.get<string>(key);
  }
  public getNumber = (key: string): number =>
    Number(this.configService.get<number>(key));
}
