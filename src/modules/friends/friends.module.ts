import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { FriendshipMetadata } from './entities/friendship-metadata.entity';
import { Friendship } from './entities/friendship.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, Friendship, FriendshipMetadata]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
