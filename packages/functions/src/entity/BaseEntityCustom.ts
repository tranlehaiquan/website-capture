import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class BaseEntityCustom extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}