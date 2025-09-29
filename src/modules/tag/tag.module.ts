import { Module, Post } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entity/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Post])],
  controllers: [TagController],
  providers: [TagService],
  exports: [TypeOrmModule, TagService], // nếu module khác cần repository Tag
})
export class TagModule {}
