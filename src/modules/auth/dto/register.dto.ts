import { UserRole } from '@/modules/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

// dto/register.dto.ts
export class RegisterDto {
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
  @ApiProperty({ example: UserRole.USER, maxLength: 100 })
  role?: UserRole;
}
