import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm/find-options/operator/ILike';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: Partial<User>) {
    // kiểm tra user đã tồn tại chưa
    const user_exists = await this.repo.findOne({
      where: { email: data.email, isActive: true },
    });
    if (user_exists) throw new Error('User already exists');
    // tạo mới user
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async findAll(page = 1, limit = 10, search = '') {
    const where = search
      ? [{ email: ILike(`%${search}%`) }, { fullName: ILike(`%${search}%`) }]
      : {};
    return this.repo.find({
      where: { ...where, isActive: true },
      take: +limit,
      skip: (+page - 1) * +limit,
      order: { id: 'ASC' },
      // relations: ['profile', ...] nếu có
    });
  }

  async findOneOrFail(id: number) {
    const user = await this.repo.findOne({ where: { id, isActive: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
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
