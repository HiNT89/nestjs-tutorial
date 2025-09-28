import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/common/guards/roles.guard';
import { UserRole } from './entity/user.entity';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, type: String })
  list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
  ) {
    return this.service.findAll({
      page,
      limit,
      search,
    });
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneOrFail(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
