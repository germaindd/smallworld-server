import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserAndSessionIds } from '../auth/models/user-and-session-ids';
import { AccessTokenGuard } from '../auth/strategies/access-token-strategy';
import { GetUserAndSessionIds } from '../auth/strategies/get-user.decorator';
import { ProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/:id')
  async getProfile(
    @Param('id') id: string,
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
  ): Promise<ProfileDto> {
    return await this.profileService.getProfile(userAndSessionIds.userId, id);
  }
}
