import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token-strategy';

@Injectable()
export class AccessTokenGuard extends AuthGuard(AccessTokenStrategy.name) {}
