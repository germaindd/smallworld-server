import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { GetUserAndSessionIds } from '../auth/strategies/get-user.decorator';
import { UserAndSessionIds } from '../auth/models/user-and-session-ids';
import { LocationDto } from './dto/location.dto';
import { AccessTokenGuard } from '../auth/strategies/access-token-strategy';
import { LocationService } from './location.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async getRequests(
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
  ): Promise<LocationDto | null> {
    return await this.locationService.get(userAndSessionIds.userId);
  }

  @UseGuards(AccessTokenGuard)
  @Put()
  async updateLocation(
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    await this.locationService.update(
      userAndSessionIds.userId,
      updateLocationDto,
    );
  }
}
