import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LocationDto } from './dto/location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly userService: UserService) {}

  async get(userId: string): Promise<LocationDto | null> {
    const user = await this.userService.getById(userId);
    if (!user) throw new BadRequestException('User does not exist.');

    return { latitude: user.latitude, longitude: user.longitude };
  }

  async update(userId: string, location: UpdateLocationDto) {
    this.userService.updateLocation(userId, location);
  }
}
