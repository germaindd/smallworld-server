import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserAndSessionIds } from '../auth/models/user-and-session-ids';
import { AccessTokenGuard } from '../auth/strategies/access-token-strategy';
import { GetUserAndSessionIds as GetUserAndSessionIds } from '../auth/strategies/get-user.decorator';
import { AcceptRequestDto } from './dto/accept-request.dto';
import { DeclineRequestDto } from './dto/decline-request.dto';
import { FriendRequestDto } from './dto/friend-request.dto';
import { SendRequestDto } from './dto/send-request.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('send-request')
  async sendRequest(
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
    @Body() sendRequestDto: SendRequestDto,
  ): Promise<void> {
    await this.friendsService.sendRequest(
      userAndSessionIds.userId,
      sendRequestDto.toUserId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('requests/accept')
  async acceptRequest(
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
    @Body() acceptRequestDto: AcceptRequestDto,
  ): Promise<void> {
    await this.friendsService.acceptRequest(
      userAndSessionIds.userId,
      acceptRequestDto.userId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('requests/decline')
  async declineRequest(
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
    @Body() declineRequestDto: DeclineRequestDto,
  ): Promise<void> {
    await this.friendsService.deleteRequest(
      userAndSessionIds.userId,
      declineRequestDto.userId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('requests')
  async getRequests(
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
  ): Promise<FriendRequestDto[]> {
    return await this.friendsService.getRequests(userAndSessionIds.userId);
  }
}
