import { BadRequestException, Injectable } from '@nestjs/common';
import { Like } from 'typeorm';
import { UserRepository } from '../auth/data/user.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class SearchService {
  constructor(private userRepository: UserRepository) {}

  async search(query: string): Promise<UserDto[]> {
    if (query.trim() === '')
      throw new BadRequestException('Query cannot be blank.');
    const users = await this.userRepository.find({
      where: {
        username: Like(`${query.toLowerCase().trim()}%`),
      },
      take: 20,
    });
    return users.map((user) => {
      return { id: user.id, username: user.username };
    });
  }
}
