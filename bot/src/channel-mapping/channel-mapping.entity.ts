import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("channel_mappings")
export class ChannelMapping {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  sourceChatId: string;

  @Column()
  destinationId: string;
}
