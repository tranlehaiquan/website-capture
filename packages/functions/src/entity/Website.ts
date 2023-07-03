import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";

@Entity()
export class Website extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // uri
  @Column({ type: "varchar", length: 255 })
  uri: string;
}
