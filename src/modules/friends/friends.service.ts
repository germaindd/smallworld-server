import {
  BadRequestException,
  ConflictException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { User } from '../user/data/user.entity';
import { UserService } from '../user/user.service';
import { FriendRequestRepository } from './data/friend-request.repository';
import { FriendshipRepository } from './data/friendship-repository';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendshipStatus } from './models/friendship-status.enum';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly friendshipRepository: FriendshipRepository,
    private readonly userService: UserService,
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
    return FriendshipStatus.NOT_FRIENDS;
  }

  async sendRequest(fromUserId: string, toUserId: string): Promise<void> {
    if (fromUserId === toUserId)
      throw new BadRequestException(
        'User cannot send a friend request to himself',
      );

    const toUser = await this.userService.getById(toUserId);
    if (!toUser) throw new BadRequestException('User does not exist.');

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
      case FriendshipStatus.NOT_FRIENDS:
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

  async acceptRequest(
    acceptingUserId: string,
    requestingUserId: string,
  ): Promise<void> {
    await this.deleteRequest(acceptingUserId, requestingUserId);

    await this.friendshipRepository.add({
      user1: acceptingUserId,
      user2: requestingUserId,
    });
  }

  async deleteRequest(
    decliningUserRequest: string,
    requestingUserId: string,
  ): Promise<void> {
    const user = this.userService.getById(requestingUserId);
    if (!user) throw new BadRequestException('Invalid userId');

    const friendRequest = await this.friendRequestRepository.findOneBy({
      fromUser: requestingUserId,
      toUser: decliningUserRequest,
    });
    if (!friendRequest)
      throw new PreconditionFailedException('Inexistent friend request.');

    await this.friendRequestRepository.delete(friendRequest);
  }

  async getRequests(userId: string): Promise<FriendRequestDto[]> {
    const requests = await this.friendRequestRepository.findBy({
      toUser: userId,
    });
    const promisedUsers = requests.map(async (request) => {
      const user = await this.userService.getById(request.fromUser);
      return user;
    });
    const users = (await Promise.all(promisedUsers)).filter(
      (user): user is User => !!user,
    );

    return users.map((user) => ({ userId: user.id, username: user.username }));
  }
}
