import { BadRequestException, Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class SearchService {
  constructor(private readonly userService: UserService) {}

  async search(query: string): Promise<UserDto[]> {
    if (query.trim() === '')
      throw new BadRequestException('Query cannot be blank.');
    const users = await this.userService.searchByUsername(query, 20);
    return users.map((user) => {
      return { id: user.id, username: user.username };
    });
  }
}
