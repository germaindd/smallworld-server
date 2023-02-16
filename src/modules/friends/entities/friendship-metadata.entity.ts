import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FriendshipMetadata {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
