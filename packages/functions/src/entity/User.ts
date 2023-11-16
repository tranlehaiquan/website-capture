import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseEntityCustom } from "./BaseEntityCustom";
import { Format, Status } from "src/constants";

@Entity()
export class User extends BaseEntityCustom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  username: string;

  // cognito user id
  @Column({ type: "varchar", length: 255, nullable: false })
  cognitoId: string;
}
