import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from '../entities/friendship.entity';

@Injectable()
export class FriendshipRepository {
  constructor(
    @InjectRepository(Friendship)
    private readonly repository: Repository<Friendship>,
  ) {}

  async exist(userOne: string, userTwo: string): Promise<boolean> {
    return this.repository.exist({
      where: { fromUser: userOne, toUser: userTwo },
    });
  }
}
