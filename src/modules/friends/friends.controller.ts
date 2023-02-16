import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserAndSessionIds } from '../auth/models/user-and-session-ids';
import { AccessTokenGuard } from '../auth/strategies/access-token-strategy';
import { GetUserAndSessionIds as GetUserAndSessionIds } from '../auth/strategies/get-user.decorator';
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
    this.friendsService.sendRequest(
      userAndSessionIds.userId,
      sendRequestDto.toUserId,
    );
  }
}
