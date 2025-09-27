import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'hashed_password', maxLength: 100 })
  passwordHash: string;
}
