import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigKeys } from 'src/config/config.schema';
import { SessionService } from 'src/modules/session/session.service';
import { AccessTokenPayload as AccessTokenPayload } from '../models/access-token-payload';
import { UserAndSessionIds } from '../models/user-and-session-ids';

const STRATEGY_NAME = 'access-token';

@Injectable()
export class AccessTokenGuard extends AuthGuard(STRATEGY_NAME) {}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_NAME,
) {
  private readonly logger = new Logger(AccessTokenStrategy.name);

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
      this.logger.warn({
        message: 'Authorization attempt with compromised access token',
        userid: payload.sub,
        sessionid: payload.sessionid,
      });
      throw new UnauthorizedException('Invalid session');
    }
    return { userId: payload.sub, sessionId: payload.sessionid };
  }
}
