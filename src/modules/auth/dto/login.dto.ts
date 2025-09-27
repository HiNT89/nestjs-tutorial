import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// dto/login.dto.ts
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'user@example.com', maxLength: 200 })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123456', minLength: 6, maxLength: 100 })
  password: string;
}
