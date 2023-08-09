import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { FriendRequestRepository } from './data/friend-request.repository';
import { FriendshipRepository } from './data/friendship-repository';
import { FriendRequestEntity } from './data/friend-request.entity';
import { FriendshipMetadataEntity } from './data/friendship-metadata.entity';
import { FriendshipEntity } from './data/friendship.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FriendRequestEntity,
      FriendshipEntity,
      FriendshipMetadataEntity,
    ]),
    UserModule,
  ],
  controllers: [FriendsController],
  exports: [FriendsService],
  providers: [FriendsService, FriendRequestRepository, FriendshipRepository],
})
export class FriendsModule {}
