// src/common/utils/paginate.ts
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { PaginateQueryDto } from '../dto/paginate-query.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export async function paginate<T extends ObjectLiteral, Dto>(
  dtoClass: new (...args: any[]) => Dto,
  source: Repository<T> | SelectQueryBuilder<T>,
  query: PaginateQueryDto,
  options: { relations?: string[] } = {},
): Promise<PaginatedResponseDto<Dto>> {
  const { page, limit, sortBy = 'id', order = 'DESC' } = query;

  let items: T[] = [];
  let total = 0;

  if (source instanceof Repository) {
    [items, total] = await source.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { [sortBy]: order } as any,
      relations: options.relations,
    });
  } else {
    [items, total] = await source
      .orderBy(sortBy, order as any)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  const data = plainToInstance(dtoClass, items, {
    excludeExtraneousValues: true,
  });

  return new PaginatedResponseDto(data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  });
}

// Sử dụng:

// async findAll(q: PaginateQueryDto) {
//   return paginate(UserResponseDto, this.repo, q);
// }

// ** relations:
// async findAll(q: PaginateQueryDto) {
//   const qb = this.repo.createQueryBuilder('post').leftJoinAndSelect('post.author', 'author');
//   return paginate(PostResponseDto, qb, q);
// }
