import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Capture } from "./Capture";
import { RecursiveCapture } from "./RecursiveCapture";

@Entity()
export class User extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  username: string;

  // cognito user id
  @Column({ type: "varchar", length: 255, nullable: false })
  cognitoId: string;

  @OneToMany(() => Capture, (uricapture) => uricapture.owner)
  uricaptures: Capture[];

  // recursiveCaptures
  @OneToMany(
    () => RecursiveCapture,
    (recursiveCapture) => recursiveCapture.owner
  )
  recursiveCaptures: RecursiveCapture[];
}
