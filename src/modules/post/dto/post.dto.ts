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
} from 'class-validator';
import { Post } from '../entity/post.entity';

export class CreatePostDto {
  @IsString()
  @ApiProperty({ example: 'post', maxLength: 60 })
  name: string;

  @IsString()
  @ApiProperty({ example: 'description', maxLength: 200 })
  description: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  authorId: number;

  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(30)
  @IsOptional()
  @ApiProperty({ example: [1, 2, 3] })
  tags_id: number[];
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
