import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Format, Status } from "src/constants";

@Entity()
export class URICapture extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // website url
  @Column({ type: "varchar", length: 255, nullable: false })
  website: string;

  // s3 key import
  @Column({ type: "varchar", length: 255, nullable: true })
  imagePath: string;

  // status
  @Column({
    type: "varchar",
    enum: Status,
    length: 255,
    default: Status.inProcess,
  })
  status: Status;

  // width
  @Column({ type: "int" })
  width: number;

  // height
  @Column({ type: "int" })
  height: number;

  // format
  @Column({
    type: "varchar",
    enum: Format,
    length: 255,
    default: Format.jpeg,
  })
  format: Format;
}
