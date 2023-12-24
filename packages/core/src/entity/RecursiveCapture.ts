import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Format } from "shared";
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

  // hours number
  @Column({ type: "int", nullable: true })
  hours?: number;

  // minutes number
  @Column({ type: "int", nullable: true })
  minutes?: number;

  // dayOfWeek number
  @Column({ type: "int", nullable: true })
  dayOfWeek?: number;

  // dayOfMonth number
  @Column({ type: "int", nullable: true })
  dayOfMonth?: number;

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
