import { BaseSoftEntity } from '@/common';
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

@Entity({ name: 'users' })
export class User extends BaseSoftEntity {
  @Index({ unique: true })
  @Column({ length: 120 })
  email: string;

  @Column({ length: 100 })
  fullName: string;

  @Column() // không trả về mặc định
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}
