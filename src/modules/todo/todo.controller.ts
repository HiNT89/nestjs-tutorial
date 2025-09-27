import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Post()
  create(@Body() body: CreateTodoDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
  // NOTE:  ParseIntPipe to convert string to number
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Patch(':id/done')
  update(@Param('id', ParseIntPipe) id: number) {
    return this.service.isDone(id);
  }

  @Get('search')
  search(@Query('search') q: string) {
    return this.service.search(q);
  }
}
