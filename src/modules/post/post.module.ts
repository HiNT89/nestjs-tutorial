import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Tag } from '@/modules/tag/entity/tag.entity';
import { User } from '@/modules/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, User])],
  controllers: [PostController],
  providers: [PostService],
  exports: [TypeOrmModule, PostService], // nếu module khác cần repository Post
})
export class PostModule {}
