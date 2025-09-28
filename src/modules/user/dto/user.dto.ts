import { BaseResponseDto } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty({ example: 'user@example.com', maxLength: 200 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'Nguyễn Văn A', maxLength: 100 })
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: '123456', maxLength: 100 })
  password: string;
}

export class UserResponseDto extends BaseResponseDto {
  @Expose()
  fullName: string;
  @Expose()
  email: string;
}
