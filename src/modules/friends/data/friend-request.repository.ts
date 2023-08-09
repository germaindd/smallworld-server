import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequestEntity } from './friend-request.entity';

@Injectable()
export class FriendRequestRepository {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private repository: Repository<FriendRequestEntity>,
  ) {}

  async add(friendRequest: FriendRequestEntity): Promise<FriendRequestEntity> {
    return this.repository.save(friendRequest);
  }

  async exist(friendRequest: FriendRequestEntity): Promise<boolean> {
    return this.repository.exist({ where: friendRequest });
  }

  async findOneBy(
    request: FriendRequestEntity,
  ): Promise<FriendRequestEntity | null> {
    return await this.repository.findOneBy(request);
  }

  async findBy(where: Partial<FriendRequestEntity>) {
    return await this.repository.findBy(where);
  }

  async delete(request: FriendRequestEntity): Promise<void> {
    await this.repository.remove(request);
  }
}
