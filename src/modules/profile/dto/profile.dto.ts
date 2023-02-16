import { FriendshipStatus } from '../../friends/models/friendship-status.enum';

export class ProfileDto {
  userId!: string;
  username!: string;
  friendshipStatus!: FriendshipStatus;
}
