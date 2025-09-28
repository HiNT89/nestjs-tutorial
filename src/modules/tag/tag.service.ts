import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Tag } from './entity/tag.entity';
import { CreateTagDto, TagResponseDto } from './dto/tag.dto';
import { plainToInstance } from 'class-transformer';
import { paginate, PaginateQueryDto } from '@/common';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  async create(data: CreateTagDto) {
    // kiểm tra user đã tồn tại chưa
    const tag_exists = await this.repo.findOne({
      where: { name: data.name, isActive: true },
    });
    if (tag_exists) throw new Error('Tag already exists');

    const savedUser = await this.repo.save({ ...data });

    return savedUser;
  }

  async findAll(q: PaginateQueryDto) {
    const { search } = q;
    // search có thể là email hoặc fullName
    const where = search ? [{ name: ILike(`%${search}%`) }] : {};

    const queryBuilder = this.repo
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.fullName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return paginate(TagResponseDto, queryBuilder, q);
  }

  async findOneOrFail(id: number) {
    const tag = await this.repo.findOne({ where: { id, isActive: true } });
    if (!tag) throw new NotFoundException('tag not found');
    const data = plainToInstance(TagResponseDto, tag, {
      excludeExtraneousValues: true,
    });
    return data;
  }

  async remove(id: number) {
    const tag = await this.findOneOrFail(id);
    // nếu ko tồn tại thì NotFoundException
    if (!tag) throw new NotFoundException('tag not found');
    tag.isActive = false; // chỉ ẩn
    return this.repo.save(tag);
  }
}
