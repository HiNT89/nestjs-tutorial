import { BaseSoftEntity } from '@/common';
import { Tag } from '@/modules/tag/entity/tag.entity';
import { User } from '@/modules/user/entity/user.entity';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, Unique } from 'typeorm';

@Entity('posts')
export class Post extends BaseSoftEntity {
  @Index({ unique: true })
  @Unique(['name'])
  @Column({ length: 60 })
  name: string;

  @Column({ length: 200, nullable: true })
  description: string;

  // Nhiều post thuộc 1 author
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    eager: false,
  })
  author: User;

  @Column()
  authorId: number; // FK tường minh, dễ query & filter

  // N—N tags
  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: ['insert'] })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
