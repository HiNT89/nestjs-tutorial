import { BaseResponseDto } from '@/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UserRole } from '../entity/user.entity';

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

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({ example: 'admin', maxLength: 100 })
  role?: UserRole;
}

export class UserResponseDto extends BaseResponseDto {
  @Expose()
  fullName: string;
  @Expose()
  email: string;

  @Expose()
  role: UserRole;
}
