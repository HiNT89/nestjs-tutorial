// src/common/dto/lite-response.dto.ts
import { Expose, plainToInstance } from 'class-transformer';

export class BaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  isActive: boolean;
}

/**
 * Helper để map entity sang LiteResponseDto
 */
export function toLiteDto<T>(
  entity: T,
  fields: (keyof T)[] = ['id' as keyof T],
) {
  const obj: any = { id: (entity as any).id };
  fields.forEach((f) => {
    if ((entity as any)[f] !== undefined) {
      obj[f] = (entity as any)[f];
    }
  });
  return plainToInstance(BaseResponseDto, obj, {
    excludeExtraneousValues: true,
  });
}

// @Expose()
//   @Transform(({ obj }) => toLiteDto(obj.author, ['id', 'email', 'fullName']))
//   author: any; // đã được map sang LiteResponseDto
