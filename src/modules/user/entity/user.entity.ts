import { BaseSoftEntity } from '@/common';
import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseSoftEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 120 })
  email: string;

  @Column({ length: 100 })
  fullName: string;

  @Column() // không trả về mặc định
  password: string;
}
