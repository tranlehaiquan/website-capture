import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Format, Status } from "../constants";
import { User } from "./User";
import { RecursiveCapture } from "./RecursiveCapture";

@Entity()
export class Capture extends BaseEntityCustom {
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

  @ManyToOne(() => User, (user) => user.uricaptures, { nullable: true })
  @JoinColumn({ name: "ownerId" }) // this is the column that will hold the foreign key
  owner?: User;

  @Column({ type: "varchar", nullable: true })
  ownerId?: string;

  // recursive capture ManyToOne
  @ManyToOne(() => RecursiveCapture, (recursiveCapture) => recursiveCapture.captures, { nullable: true })
  @JoinColumn({ name: "recursiveCaptureId" }) // this is the column that will hold the foreign key
  recursiveCapture?: RecursiveCapture;

  @Column({ type: "varchar", nullable: true })
  recursiveCaptureId: string;
}
