import { BaseSoftEntity } from '@/common';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity('posts')
export class Post extends BaseSoftEntity {
  @Index({ unique: true })
  @Unique(['name'])
  @Column({ length: 60 })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;
}
