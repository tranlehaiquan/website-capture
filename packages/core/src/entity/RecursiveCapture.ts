import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Format } from "../constants";
import { User } from "./User";
import { Capture } from "./Capture";

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

  // schedule
  @Column({ type: "varchar", length: 255 })
  schedule: string;

  // scheduleOptions
  @Column({ type: "json" })
  scheduleOptions: any;

  // owner
  @ManyToOne(() => User, (user) => user.recursiveCaptures)
  @JoinColumn({ name: "ownerId" }) // this is the column that will hold the foreign key
  owner: User;

  @Column({ type: "varchar" })
  ownerId: string;

  // end time
  @Column({ type: "timestamp", nullable: true })
  endTime: Date;

  // ScheduleArn
  @Column({ type: "varchar", nullable: true })
  scheduleArn: string;

  // captures OneToMany one recursive capture can have many captures
  @OneToMany(() => Capture, (capture) => capture.recursiveCapture)
  captures: Capture[];
}
