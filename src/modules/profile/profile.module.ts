import { Module } from '@nestjs/common';
import { FriendsModule } from '../friends/friends.module';
import { UserModule } from '../user/user.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UserModule, FriendsModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
