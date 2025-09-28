import { UserRole } from '@/modules/user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfg.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: string; email: string; role: UserRole }) {
    console.log('🚀 ~ JwtStrategy ~ validate ~ payload:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
