// src/common/dto/paginated-response.dto.ts
export class PaginatedResponseDto<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  constructor(data: T[], meta: PaginatedResponseDto<T>['meta']) {
    this.data = data;
    this.meta = meta;
  }
}

// Sử dụng:

// const data = plainToInstance(PostResponseDto, items, {
//   excludeExtraneousValues: true,
// });

// return new PaginatedResponseDto(data, {
//   page: q.page,
//   limit: q.limit,
//   total,
//   totalPages: Math.ceil(total / q.limit),
//   hasNext: q.page * q.limit < total,
//   hasPrev: q.page > 1,
// });
