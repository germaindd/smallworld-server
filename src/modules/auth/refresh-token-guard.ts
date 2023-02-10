import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(
  RefreshTokenStrategy.strategyName,
) {}
