import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { FriendshipMetadata } from './friendship-metadata.entity';

@Entity({ name: 'friendship' })
export class FriendshipEntity {
  @Index()
  @PrimaryColumn('uuid')
  fromUser!: string;

  @PrimaryColumn('uuid')
  toUser!: string;

  @ManyToOne(() => FriendshipMetadata, { nullable: false })
  @JoinColumn()
  metadata!: FriendshipMetadata;
}
