import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { URICapture } from "./URICapture";

@Entity()
export class User extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  username: string;

  // cognito user id
  @Column({ type: "varchar", length: 255, nullable: false })
  cognitoId: string;

  @OneToMany(() => URICapture, (uricapture) => uricapture.owner)
  uricaptures: URICapture[];
}
