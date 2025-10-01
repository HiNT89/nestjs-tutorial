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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post()
  create(@Body() dto: CreatePostDto) {
    console.log(
      '🚀 ~ PostController ~ create ~ received dto:',
      JSON.stringify(dto, null, 2),
    );
    console.log('🚀 ~ PostController ~ create ~ dto type:', typeof dto);
    console.log(
      '🚀 ~ PostController ~ create ~ tags_id type:',
      typeof dto.tags_id,
      'value:',
      dto.tags_id,
    );
    return this.service.create(dto);
  }
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
    return this.service.remove(+id);
  }
}
