import { FriendRequest } from 'src/modules/friends/entities/friend-request.entity';
import { Friendship } from 'src/modules/friends/entities/friendship.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  // todo see if i really want these or if i prefer to load the relations myself by
  // querying the relevant tables
  @ManyToMany(() => Friendship, (frienship) => frienship.fromUser)
  friends!: Friendship[];

  @ManyToMany(() => FriendRequest, (request) => request.fromUser)
  sentRequests!: FriendRequest[];

  @ManyToMany(() => FriendRequest, (request) => request.toUser)
  receivedRequests!: FriendRequest[];
}
