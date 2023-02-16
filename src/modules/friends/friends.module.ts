import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendshipMetadata } from './entities/friendship-metadata.entity';
import { Friendship } from './entities/friendship.entity';
import { FriendRequestRepository } from './data/friend-request.repository';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendshipRepository } from './data/friendship-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, Friendship, FriendshipMetadata]),
  ],
  controllers: [FriendsController],
  exports: [FriendsService],
  providers: [FriendsService, FriendRequestRepository, FriendshipRepository],
})
export class FriendsModule {}
