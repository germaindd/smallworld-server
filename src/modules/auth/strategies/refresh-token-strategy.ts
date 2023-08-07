import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigKeys } from 'src/config/config.schema';
import { SessionService } from 'src/modules/session/session.service';
import { RefreshTokenPayload } from '../models/refresh-token-payload';
import { UserAndSessionIds } from '../models/user-and-session-ids';

const STRATEGY_NAME = 'refresh-token';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(STRATEGY_NAME) {}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  private readonly logger = new Logger(RefreshTokenStrategy.name);

  private readonly accessTokenLifespanMilliseconds: number;
  constructor(
    configService: ConfigService,
    private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigKeys.REFRESH_TOKEN_SECRET),
    });
    this.accessTokenLifespanMilliseconds = configService.getOrThrow(
      ConfigKeys.ACCESS_TOKEN_EXPIRY_MINUTES,
    );
  }

  async validate(payload: RefreshTokenPayload): Promise<UserAndSessionIds> {
    const session = await this.sessionService.get(payload.sessionid);
    if (session === null) {
      // user session may have expired, or it could be an attacker reattempting authorization
      // with a token that has been reused
      throw new UnauthorizedException('Invalid session');
    }
    if (session.tokenId !== payload.jti) {
      this.logger.warn({
        message: 'Refresh token reused',
        userid: payload.sub,
        sessionid: payload.sessionid,
      });
      // a new refresh token has already been issued, meaning this is an old token
      // that is attempting reuse. reuse of a refresh token means session has been compromised.
      // revoke the session and invalidate all associated tokens
      this.sessionService.delete(session.id);
      this.sessionService.setCompromised(
        session.id,
        // allow the session service to clear it's reference to the compromised session after any
        // access token associated with it will have expired
        new Date(Date.now() + this.accessTokenLifespanMilliseconds),
      );
      throw new UnauthorizedException('Invalid session');
    }
    return { userId: payload.sub, sessionId: payload.sessionid };
  }
}
