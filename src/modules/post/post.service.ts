import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { post } from './entity/post.entity';
import { CreatePostDto, PostResponseDto } from './dto/post.dto';
import { plainToInstance } from 'class-transformer';
import { paginate, PaginateQueryDto } from '@/common';

@Injectable()
export class PostService {
  constructor(@InjectRepository(post) private repo: Repository<post>) {}

  async create(data: CreatePostDto) {
    // kiểm tra user đã tồn tại chưa
    const tag_exists = await this.repo.findOne({
      where: { name: data.name, isActive: true },
    });
    if (tag_exists) throw new Error('post already exists');

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

    return paginate(PostResponseDto, queryBuilder, q);
  }

  async findOneOrFail(id: number) {
    const post = await this.repo.findOne({ where: { id, isActive: true } });
    if (!post) throw new NotFoundException('post not found');
    const data = plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
    return data;
  }

  async remove(id: number) {
    const post = await this.findOneOrFail(id);
    // nếu ko tồn tại thì NotFoundException
    if (!post) throw new NotFoundException('post not found');
    post.isActive = false; // chỉ ẩn
    return this.repo.save(post);
  }
}
