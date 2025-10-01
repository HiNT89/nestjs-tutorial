import { BaseResponseDto, toLiteDto } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Post } from '../entity/post.entity';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: 'post', maxLength: 60 })
  name: string;

  @IsString()
  @ApiProperty({ example: 'description', maxLength: 200 })
  description: string;

  @IsNumber()
  @IsPositive() // kiểm tra số dương
  @IsInt() // kiểm tra số nguyên
  @ApiProperty({ example: 1 })
  authorId: number;

  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(30)
  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Type(() => Number)
  @ApiProperty({ example: [1, 2, 3], required: false })
  tags_id?: number[];
}

export class PostResponseDto extends BaseResponseDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ obj }: { obj: Post }) =>
    obj.author ? toLiteDto(obj.author, ['id', 'email', 'fullName']) : null,
  )
  author: any;

  @Expose()
  @Transform(({ obj }: { obj: Post }) =>
    Array.isArray(obj.tags)
      ? obj.tags.map((t) => toLiteDto(t, ['id', 'name']))
      : [],
  )
  tags: any[];
}
