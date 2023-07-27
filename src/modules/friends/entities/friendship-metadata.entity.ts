import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'friendship_metadata' })
export class FriendshipMetadataEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
