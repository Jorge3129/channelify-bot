import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tokens")
export class GPTToken extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  userId: number;

  @Column()
  token: string;
}
