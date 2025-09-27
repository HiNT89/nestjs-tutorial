import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private idSeq = 1;

  create(dto: CreateTodoDto) {
    const todo: Todo = { id: this.idSeq++, title: dto.title, isDone: false };
    this.todos.push(todo);
    return todo;
  }

  remove(id: number) {
    const idx = this.todos.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundException('Todo not found');
    this.todos.splice(idx, 1);
  }

  findAll() {
    return this.todos;
  }

  isDone(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) throw new NotFoundException('Todo not found');
    todo.isDone = true;
    return todo;
  }

  search(q: string) {
    return this.todos.filter((t) => {
      const t_lower = t.title.toLowerCase();
      const q_lower = q.toLowerCase();
      return t_lower.includes(q_lower);
    });
  }
}
