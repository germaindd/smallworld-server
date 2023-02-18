import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequest } from '../entities/friend-request.entity';

@Injectable()
export class FriendRequestRepository {
  constructor(
    @InjectRepository(FriendRequest)
    private repository: Repository<FriendRequest>,
  ) {}

  async add(friendRequest: FriendRequest): Promise<FriendRequest> {
    return this.repository.save(friendRequest);
  }

  async exist(friendRequest: FriendRequest): Promise<boolean> {
    return this.repository.exist({ where: friendRequest });
  }

  async findOneBy(request: FriendRequest): Promise<FriendRequest | null> {
    return this.repository.findOneBy(request);
  }

  async delete(request: FriendRequest): Promise<void> {
    await this.repository.remove(request);
  }
}
