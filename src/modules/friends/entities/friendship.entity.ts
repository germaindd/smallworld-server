import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { FriendshipMetadata } from './friendship-metadata.entity';

@Entity()
export class Friendship {
  @PrimaryColumn('uuid')
  fromUser!: string;

  @PrimaryColumn('uuid')
  toUser!: string;

  @OneToOne(() => FriendshipMetadata, { nullable: false })
  @JoinColumn()
  metadata!: FriendshipMetadata;
}
