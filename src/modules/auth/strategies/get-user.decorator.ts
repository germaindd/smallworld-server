import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAndSessionIds } from '../models/user-and-session-ids';

export const GetUserAndSessionIds = createParamDecorator(
  (_data, ctx: ExecutionContext): UserAndSessionIds => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
