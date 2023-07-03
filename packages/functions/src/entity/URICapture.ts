import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Website } from "./Website";

export enum Status {
  "inProcess" = "inProcess",
  "successful" = "successful",
  "failed" = "failed",
}

@Entity()
export class URICapture extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  public websiteId: string;
  @ManyToOne(() => Website, website => website)
  website: Website;

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
}
