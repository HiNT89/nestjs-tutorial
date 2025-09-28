import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm/find-options/operator/ILike';
import { paginate, PaginateQueryDto } from '@/common';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: CreateUserDto) {
    // kiểm tra user đã tồn tại chưa
    const user_exists = await this.repo.findOne({
      where: { email: data.email, isActive: true },
    });
    if (user_exists) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(data.password, 10);
    // tạo mới user

    const savedUser = await this.repo.save({ ...data, password: passwordHash });

    return savedUser;
  }

  async findAll(q: PaginateQueryDto) {
    const { search } = q;
    // search có thể là email hoặc fullName
    const where = search
      ? [{ email: ILike(`%${search}%`) }, { fullName: ILike(`%${search}%`) }]
      : {};

    const queryBuilder = this.repo
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.fullName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return paginate(UserResponseDto, queryBuilder, q);
  }

  async findOneOrFail(id: number) {
    const user = await this.repo.findOne({ where: { id, isActive: true } });
    if (!user) throw new NotFoundException('User not found');
    const data = plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
    return data;
  }

  async remove(id: number) {
    const user = await this.findOneOrFail(id);
    // nếu ko tồn tại thì NotFoundException
    if (!user) throw new NotFoundException('User not found');
    user.isActive = false; // chỉ ẩn
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email, isActive: true } });
  }

  findWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
  }
}
