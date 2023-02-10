import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigKeys } from 'src/config/config.schema';
import { SessionService } from 'src/modules/session/session.service';
import { AccessTokenPayload as AccessTokenPayload } from '../models/access-token-payload';
import { UserAndSessionIds } from '../models/user-and-session-ids';

const STRATEGY_NAME = 'access-token';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_NAME,
) {
  static strategyName = STRATEGY_NAME;

  constructor(
    configService: ConfigService,
    private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigKeys.ACCESS_TOKEN_SECRET),
    });
  }

  validate(payload: AccessTokenPayload): UserAndSessionIds {
    if (this.sessionService.isCompromised(payload.sessionid)) {
      throw new UnauthorizedException('Invalid session');
    }
    return { userId: payload.sub, sessionId: payload.sessionid };
  }
}
