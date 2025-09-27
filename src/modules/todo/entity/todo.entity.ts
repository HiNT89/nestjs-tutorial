import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  id: number;

  title: string;

  isDone: boolean;
}
