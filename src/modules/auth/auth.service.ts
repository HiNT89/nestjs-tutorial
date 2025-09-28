import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import jwtConfig from '@/common/config/jwt.config';
import { UserRole } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.users.create(dto);
    return this.issueTokens(user.id, user.email, user.role || UserRole.USER);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.users.findWithPassword(email); // repo.addSelect('passwordHash')
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password);
    if (!ok) return null;
    return { id: user.id, email: user.email };
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.users.findByEmail(dto.email);
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      return this.issueTokens(user.id, user.email, user.role);
    } catch (error) {
      console.log('Login error:', error);
    }
  }

  async refreshToken(refresh: string) {
    const payload = await this.jwt.verifyAsync(refresh, {
      secret: this.cfg.get('JWT_REFRESH_SECRET'),
    });
    return this.issueTokens(payload.sub, payload.email, payload.role);
  }

  private issueTokens(
    sub: number,
    email: string,
    role: UserRole = UserRole.USER,
  ) {
    const accessToken = this.jwt.sign(
      { email, role },
      {
        secret: this.cfg.get('JWT_SECRET'),
        expiresIn: this.cfg.get('JWT_EXPIRES_IN') ?? '15m',
        subject: String(sub),
        // Remove audience claim
      },
    );
    const refreshToken = this.jwt.sign(
      { email },
      {
        secret: this.cfg.get('JWT_REFRESH_SECRET'),
        expiresIn: this.cfg.get('JWT_REFRESH_EXPIRES_IN') ?? '7d',
        subject: String(sub),
        // Remove audience claim
      },
    );
    return { accessToken, refreshToken };
  }

  async getMe(token: string): Promise<any> {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        // Remove or adjust audience verification if needed
        // audience: 'localhost:3000', // Only include if you want to verify audience
      });

      if (payload === null) {
        return null;
      }
      const id = payload['sub'];
      console.log('🚀 ~ AuthService ~ getMe ~ id:', id);

      return this.users.findOneOrFail(id);
    } catch (err) {
      console.log('🚀 ~ AuthService ~ getMe ~ err:', err);
      return null;
    }
  }
}
