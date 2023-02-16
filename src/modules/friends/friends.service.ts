import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { FriendshipStatus } from './models/friendship-status.enum';
import { FriendRequestRepository } from './data/friend-request.repository';
import { FriendshipRepository } from './data/friendship-repository';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly friendshipRepository: FriendshipRepository,
  ) {}

  private async friendshipExists(
    fromUserId: string,
    toUserId: string,
  ): Promise<boolean> {
    return await this.friendshipRepository.exist(fromUserId, toUserId);
  }

  private async friendRequestExists(fromUserId: string, toUserId: string) {
    return await this.friendRequestRepository.exist({
      fromUser: fromUserId,
      toUser: toUserId,
    });
  }

  async getFriendshipStatus(
    fromUserId: string,
    toUserId: string,
  ): Promise<FriendshipStatus> {
    if (await this.friendshipExists(fromUserId, toUserId))
      return FriendshipStatus.FRIENDS;
    if (await this.friendRequestExists(fromUserId, toUserId))
      return FriendshipStatus.OUTGOING_REQUEST;
    if (await this.friendRequestExists(toUserId, fromUserId))
      return FriendshipStatus.INCOMING_REQUEST;
    return FriendshipStatus.NONE;
  }

  async sendRequest(fromUserId: string, toUserId: string): Promise<void> {
    const friendshipStatus = await this.getFriendshipStatus(
      fromUserId,
      toUserId,
    );
    switch (friendshipStatus) {
      case FriendshipStatus.FRIENDS:
        throw new PreconditionFailedException(
          'User is already friends with this user.',
        );
      case FriendshipStatus.OUTGOING_REQUEST:
        throw new ConflictException('Request already exists');
      case FriendshipStatus.INCOMING_REQUEST:
        throw new PreconditionFailedException(
          'Cannot send a friend request to someone who one already has a pending request from ',
        );
      case FriendshipStatus.NONE:
        await this.friendRequestRepository.add({
          fromUser: fromUserId,
          toUser: toUserId,
        });
        break;
      default:
        const _exhaustive: never = friendshipStatus;
        return _exhaustive;
    }
  }
}
