import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class ParamFileName {
  @ApiProperty({
    example: '',
    description: 'name of the file that was uploaded',
  })
  @IsString()
  filename: string;
}

export default ParamFileName;
