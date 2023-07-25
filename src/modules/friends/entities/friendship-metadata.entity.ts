import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'friendship_metadata' })
export class FriendshipMetadata {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
