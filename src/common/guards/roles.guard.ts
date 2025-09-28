// src/common/guards/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = ctx.switchToHttp().getRequest(); // user từ JwtStrategy
    if (!user?.role) return false;

    // user.role là string hoặc enum => normalize
    const role = String(user.role).toLowerCase();

    // Quy tắc cơ bản: nếu required chứa 'admin' và user là admin => pass
    // Có thể cắm ma trận phân quyền phức tạp tại đây.
    return required.map((r) => r.toLowerCase()).includes(role);
  }
}
