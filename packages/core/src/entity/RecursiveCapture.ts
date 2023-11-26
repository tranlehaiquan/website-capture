import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Format } from "../constants";

@Entity()
export class RecursiveCapture extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  website: string;

  @Column({ type: "int" })
  width: number;

  @Column({ type: "int" })
  height: number;

  @Column({
    type: "varchar",
    enum: Format,
    length: 255,
    default: Format.jpeg,
  })
  format: Format;
}
