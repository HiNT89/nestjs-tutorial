import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isDone: boolean;
}
