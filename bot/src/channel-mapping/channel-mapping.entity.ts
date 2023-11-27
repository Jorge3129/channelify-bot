import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TelegramChat } from "../core-api/telegram-core-api.service";

@Entity("channel_mappings")
export class ChannelMapping {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  sourceChatId: string;

  @Column()
  sourceChatUrl: string;

  @Column({ type: "jsonb", nullable: true })
  sourceChat: TelegramChat;

  @Column({ nullable: true })
  destinationId: string;

  @Column({ type: "jsonb", nullable: true })
  destinationChat: TelegramChat;

  @Column()
  destinationChatUrl: string;

  @Column({ nullable: true })
  inviteLink: string;
}
