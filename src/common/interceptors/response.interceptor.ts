// src/common/interceptors/response.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// return {
//   data: items,
//   meta: {
//     page,
//     limit,
//     total,
//     totalPages: Math.ceil(total / limit),
//     hasNext: page * limit < total,
//     hasPrev: page > 1,
//   },
// };
// Interceptor sẽ tự “nhét” vào meta.pagination.

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        const isPaginated =
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data &&
          data.meta?.total !== undefined;

        if (isPaginated) {
          return {
            success: true,
            data: data.data,
            meta: {
              statusCode: response.statusCode,
              timestamp: new Date().toISOString(),
              path: request.url,
              pagination: {
                page: data.meta.page,
                limit: data.meta.limit,
                total: data.meta.total,
                totalPages: data.meta.totalPages,
                hasNext: data.meta.hasNext,
                hasPrev: data.meta.hasPrev,
              },
            },
          };
        }

        return {
          success: true,
          data,
          meta: {
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };
      }),
    );
  }
}
