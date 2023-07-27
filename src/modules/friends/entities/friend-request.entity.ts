import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'friends_request' })
export class FriendRequestEntity {
  @Index()
  @PrimaryColumn('uuid')
  fromUser!: string;

  @Index()
  @PrimaryColumn('uuid')
  toUser!: string;
}
