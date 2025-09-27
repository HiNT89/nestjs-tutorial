import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }

  @Put(':id/done')
  update(@Param('id') id: number) {
    return this.service.isDone(id);
  }

  @Get('search')
  search(@Query('search') q: string) {
    return this.service.search(q);
  }
}
