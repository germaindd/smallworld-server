import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { FriendshipMetadataEntity } from './friendship-metadata.entity';

@Entity({ name: 'friendship' })
export class FriendshipEntity {
  @Index()
  @PrimaryColumn('uuid')
  fromUser!: string;

  @PrimaryColumn('uuid')
  toUser!: string;

  @ManyToOne(() => FriendshipMetadataEntity, { nullable: false })
  @JoinColumn()
  metadata!: FriendshipMetadataEntity;
}
