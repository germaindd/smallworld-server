import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigKeys } from 'src/config/config.schema';
import { TokenPayload as AccessTokenPayload } from '../../session/models/token-payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(ConfigKeys.JWT_SECRET),
    });
  }

  async validate(payload: AccessTokenPayload) {
    // yet to implement
    return;
  }
}
