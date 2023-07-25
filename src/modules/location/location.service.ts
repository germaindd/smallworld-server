import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendsService } from '../friends/friends.service';
import { UserService } from '../user/user.service';
import { LocationDto } from './dto/location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    private readonly userService: UserService,
    private readonly friendsService: FriendsService,
  ) {}

  async get(userId: string): Promise<LocationDto | null> {
    const user = await this.userService.getById(userId);
    if (!user) throw new BadRequestException('User does not exist.');

    return { userId, latitude: user.latitude, longitude: user.longitude };
  }

  async getFriendsLocations(userId: string) {
    const friends = await this.friendsService.getAllFriends(userId);
    const locations: LocationDto[] = friends.map((user) => ({
      userId: user.id,
      latitude: user.latitude,
      longitude: user.longitude,
    }));
    return locations;
  }

  async update(userId: string, location: UpdateLocationDto) {
    this.userService.updateLocation(userId, location);
  }
}
