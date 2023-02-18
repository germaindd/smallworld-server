import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendsService } from '../friends/friends.service';
import { UserService } from '../user/user.service';
import { ProfileDto } from './dto/profile.dto';
import { FriendshipStatus } from '../friends/models/friendship-status.enum';

@Injectable()
export class ProfileService {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly userService: UserService,
  ) {}

  async getProfile(
    userId: string,
    userIdForProfile: string,
  ): Promise<ProfileDto> {
    const userForProfile = await this.userService.getById(userIdForProfile);

    if (!userForProfile) throw new BadRequestException('User does not exist.');

    const friendshipStatus: FriendshipStatus =
      await this.friendsService.getFriendshipStatus(userId, userIdForProfile);
    return {
      userId: userIdForProfile,
      username: userForProfile.username,
      friendshipStatus,
    };
  }
}
