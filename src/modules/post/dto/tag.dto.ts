import { BaseResponseDto } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @ApiProperty({ example: 'tag', maxLength: 60 })
  name: string;

  @IsString()
  @ApiProperty({ example: 'description', maxLength: 200 })
  description: string;
}

export class TagResponseDto extends BaseResponseDto {
  @Expose()
  name: string;

  @Expose()
  description: string;
}
