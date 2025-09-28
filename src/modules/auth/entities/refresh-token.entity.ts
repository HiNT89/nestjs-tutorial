// src/modules/auth/entities/refresh-token.entity.ts
import { User } from '@/modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'auth_refresh_tokens' })
@Index(['userId', 'revokedAt'])
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number; // token record id

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  jti: string; // JWT ID cho token (nhét vào payload)

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column() // bcrypt hash của refresh token
  tokenHash: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt?: Date | null;

  @Column({ type: 'uuid', nullable: true })
  replacedByTokenId?: string | null; // id của token mới khi rotate

  // Optional: quản lý theo thiết bị/UA
  @Column({ nullable: true }) deviceId?: string | null;
  @Column({ nullable: true }) userAgent?: string | null;
  @Column({ nullable: true }) ip?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
