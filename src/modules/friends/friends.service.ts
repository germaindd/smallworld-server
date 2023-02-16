import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { FriendRequestRepository } from './data/friend-request.repository';
import { FriendshipRepository } from './data/friendship-repository';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly friendshipRepository: FriendshipRepository,
  ) {}

  async sendRequest(fromUserId: string, toUserId: string): Promise<void> {
    if (await this.friendshipRepository.exist(fromUserId, toUserId)) {
      throw new PreconditionFailedException(
        'User is already friends with this user.',
      );
    }
    if (
      await this.friendRequestRepository.exist({
        fromUser: fromUserId,
        toUser: toUserId,
      })
    ) {
      throw new ConflictException('Request already exists');
    }
    if (
      await this.friendRequestRepository.exist({
        fromUser: toUserId,
        toUser: fromUserId,
      })
    ) {
      throw new PreconditionFailedException(
        'Cannot send a friend request to someone who one already has a pending request from ',
      );
    }
    this.friendRequestRepository.add({
      fromUser: fromUserId,
      toUser: toUserId,
    });
  }
}
