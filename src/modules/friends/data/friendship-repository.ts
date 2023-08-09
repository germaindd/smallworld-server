import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendshipMetadataEntity } from './friendship-metadata.entity';
import { FriendshipEntity as FriendshipEntity } from './friendship.entity';
import { Friendship } from '../models/friendship';

@Injectable()
export class FriendshipRepository {
  constructor(
    @InjectRepository(FriendshipEntity)
    private readonly friendshipRepo: Repository<FriendshipEntity>,
    @InjectRepository(FriendshipMetadataEntity)
    private readonly metadataRepo: Repository<FriendshipMetadataEntity>,
  ) {}

  async exist(userOne: string, userTwo: string): Promise<boolean> {
    return this.friendshipRepo.exist({
      where: { fromUser: userOne, toUser: userTwo },
    });
  }

  async getAllFriendships(user: string): Promise<Array<FriendshipEntity>> {
    return await this.friendshipRepo.find({ where: { fromUser: user } });
  }

  async add(friendship: Friendship): Promise<void> {
    const metadata = await this.metadataRepo.save({});
    await this.friendshipRepo.save([
      {
        fromUser: friendship.user1,
        toUser: friendship.user2,
        metadata: metadata,
      },
      {
        fromUser: friendship.user2,
        toUser: friendship.user1,
        metadata: metadata,
      },
    ]);
  }
}
