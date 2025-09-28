// src/common/entities/base-soft.entity.ts
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseSoftEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
