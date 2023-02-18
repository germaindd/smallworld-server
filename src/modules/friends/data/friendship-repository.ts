import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendshipMetadata } from '../entities/friendship-metadata.entity';
import { Friendship as FriendshipEntity } from '../entities/friendship.entity';

export class Friendship {
  user1!: string;
  user2!: string;
}

@Injectable()
export class FriendshipRepository {
  constructor(
    @InjectRepository(FriendshipEntity)
    private readonly friendshipRepo: Repository<FriendshipEntity>,
    @InjectRepository(FriendshipMetadata)
    private readonly metadataRepo: Repository<FriendshipMetadata>,
  ) {}

  async exist(userOne: string, userTwo: string): Promise<boolean> {
    return this.friendshipRepo.exist({
      where: { fromUser: userOne, toUser: userTwo },
    });
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
