import { BaseSoftEntity } from '@/common';
import { Column, Entity, Index, Unique } from 'typeorm';

@Entity('tags')
export class Tag extends BaseSoftEntity {
  @Index({ unique: true })
  @Unique(['name'])
  @Column({ length: 60 })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;
}
