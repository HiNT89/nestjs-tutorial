import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { CreatePostDto, PostResponseDto } from './dto/post.dto';
import { plainToInstance } from 'class-transformer';
import { paginate, PaginateQueryDto } from '@/common';
import { Tag } from '../tag/entity/tag.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private async resolveTags(list_tag_id: number[] = []) {
    try {
      // xử lý loại bỏ trùng, trim, lọc bỏ rỗng
      if (!list_tag_id.length) return [];
      // new Set() để loại bỏ trùng
      const uniq = [...new Set(list_tag_id.map((n) => n).filter(Boolean))];
      const existing = await this.tagRepo.find({
        where: { id: In(uniq) } as any,
      });

      if (existing.length !== uniq.length) {
        throw new NotFoundException(`Some tags not found`);
      }
      return existing;
      // const existNames = new Set(existing.map((t) => t.name));
      // const toCreate = uniq
      //   .map((n) => {
      //     const payload = { name: n };
      //     return this.tagRepo.create(payload);
      //   });
      // const created = await this.tagRepo.save(toCreate);
      // return [...existing, ...created];
    } catch (error) {
      console.log('🚀 ~ PostService ~ resolveTags ~ error:', error);
      throw error;
    }
  }

  async create(data: CreatePostDto) {
    try {
      console.log(
        '🚀 ~ PostService ~ create ~ data:',
        JSON.stringify(data, null, 2),
      );
      console.log(
        '🚀 ~ PostService ~ create ~ tags_id:',
        data.tags_id,
        'type:',
        typeof data.tags_id,
      );

      // kiểm tra tags đã tồn tại chưa
      const tags = await this.resolveTags(data.tags_id || []);
      console.log('🚀 ~ PostService ~ create ~ pass_check_tags:', tags);

      // check user exist
      const user_exists = await this.userRepo.findOne({
        where: { id: data.authorId },
      });
      console.log('🚀 ~ PostService ~ create ~ user_exists:', user_exists);

      if (!user_exists) {
        throw new NotFoundException(`User with id ${data.authorId} not found`);
      }

      const savedPost = await this.postRepo.save({ ...data, tags });
      console.log('🚀 ~ PostService ~ create ~ savedPost:', savedPost);

      // load relations tối thiểu để map DTO
      const withRels = await this.postRepo.findOne({
        where: { id: savedPost.id },
        relations: ['author', 'tags'],
      });
      console.log('🚀 ~ PostService ~ create ~ withRels:', withRels);

      return withRels;
    } catch (error) {
      console.log('🚀 ~ PostService ~ create ~ error:', error);
      console.log('🚀 ~ PostService ~ create ~ error message:', error.message);
      console.log('🚀 ~ PostService ~ create ~ error stack:', error.stack);
      // ✅ Ném lại error để client biết có lỗi xảy ra
      throw error;
    }
  }

  async findAll(q: PaginateQueryDto) {
    const { search, page = 1, limit = 10, sortBy = 'id', order = 'DESC' } = q;

    const queryBuilder = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'user')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere('(post.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // Tự xử lý orderBy để tránh ambiguous column reference
    const sortColumn = sortBy === 'id' ? 'post.id' : `post.${sortBy}`;
    queryBuilder.orderBy(sortColumn, order as any);

    // Tự xử lý pagination
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = plainToInstance(PostResponseDto, items, {
      excludeExtraneousValues: true,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOneOrFail(id: number) {
    const post = await this.postRepo.findOne({ where: { id, isActive: true } });
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
    return this.postRepo.save(post);
  }
}
