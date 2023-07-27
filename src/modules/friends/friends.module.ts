import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { FriendRequestRepository } from './data/friend-request.repository';
import { FriendshipRepository } from './data/friendship-repository';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendshipMetadataEntity } from './entities/friendship-metadata.entity';
import { FriendshipEntity } from './entities/friendship.entity';
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
