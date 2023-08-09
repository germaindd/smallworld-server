import { FriendRequestEntity } from 'src/modules/friends/data/friend-request.entity';
import { FriendshipEntity } from 'src/modules/friends/data/friendship.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true })
  email!: string;

  @Index()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'float', nullable: true })
  latitude?: number;

  @Column({ type: 'float', nullable: true })
  longitude?: number;

  // todo see if i really want these or if i prefer to load the relations myself by
  // querying the relevant tables
  @ManyToMany(() => FriendshipEntity, (frienship) => frienship.fromUser)
  friends!: FriendshipEntity[];

  @ManyToMany(() => FriendRequestEntity, (request) => request.fromUser)
  sentRequests!: FriendRequestEntity[];

  @ManyToMany(() => FriendRequestEntity, (request) => request.toUser)
  receivedRequests!: FriendRequestEntity[];
}
