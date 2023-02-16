import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class FriendRequest {
  @Index()
  @PrimaryColumn('uuid')
  fromUser!: string;

  @Index()
  @PrimaryColumn('uuid')
  toUser!: string;
}
