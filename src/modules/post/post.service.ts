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
  }

  async create(data: CreatePostDto) {
    try {
      console.log('🚀 ~ PostService ~ create ~ data:', data);
      // kiểm tra tags đã tồn tại chưa
      const tags = await this.resolveTags(data.tags_id);
      console.log('🚀 ~ PostService ~ create ~ pass_check_tags:', tags);
      // check user exist
      const user_exists = await this.userRepo.findOne({
        where: { id: data.authorId },
      });
      console.log('🚀 ~ PostService ~ create ~ user_exists:', user_exists);
      if (tags && user_exists) {
        const savedPost = await this.postRepo.save({ ...data, tags });
        // load relations tối thiểu để map DTO
        const withRels = await this.postRepo.findOne({
          where: { id: savedPost.id },
          relations: ['author', 'tags'],
        });
        return withRels;
      } else {
        throw new NotFoundException(`Some tags or user not found`);
      }
    } catch (error) {
      console.log('🚀 ~ PostService ~ create ~ error:', error);
    }
  }

  async findAll(q: PaginateQueryDto) {
    const { search } = q;
    // search có thể là email hoặc fullName
    const where = search ? [{ name: ILike(`%${search}%`) }] : {};

    const queryBuilder = this.postRepo
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
