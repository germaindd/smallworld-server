import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigKeys } from 'src/config/config.schema';
import * as Regex from 'src/modules/auth/constants/regex';
import { SessionEntity } from '../session/data/session.entity';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { JwtDto } from './dto/jwt-dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ValidateSignUpResponseDto } from './dto/validate-sign-up-response.dto';
import { ValidateSignUpDto } from './dto/validate-sign-up.dto';
import { AccessTokenPayload } from './models/access-token-payload';
import { RefreshTokenPayload } from './models/refresh-token-payload';
import { SignUpValidationResult } from './models/sign-up-validation-result';
import { UserAndSessionIds } from './models/user-and-session-ids';

const MILLISECONDS_IN_ONE_SECOND = 1000;
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  private readonly accessTokenSecret = this.configService.get(
    ConfigKeys.ACCESS_TOKEN_SECRET,
  );
  private readonly refreshTokenSecret = this.configService.get(
    ConfigKeys.REFRESH_TOKEN_SECRET,
  );
  private readonly accessTokenLifespanSeconds =
    this.configService.get(ConfigKeys.ACCESS_TOKEN_EXPIRY_MINUTES) * 60;

  private async getTokens(
    userId: string,
    session: SessionEntity,
  ): Promise<JwtDto> {
    const accessTokenPayload: AccessTokenPayload = {
      sub: userId,
      sessionid: session.id,
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      ...accessTokenPayload,
      jti: session.tokenId,
      exp: Math.round(session.expiry.getTime() / MILLISECONDS_IN_ONE_SECOND), // iat format for jwt's is *seconds* since epoch hence the conversion
    };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenLifespanSeconds,
    });
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.refreshTokenSecret,
    });
    return { accessToken, refreshToken };
  }

  async signUp(signUpDto: SignUpDto): Promise<JwtDto> {
    const { username, email, password } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userService.add(username, hashedPassword, email);

    const session = await this.sessionService.create();
    return this.getTokens(user.id, session);
  }

  async signIn(signInDto: SignInDto): Promise<JwtDto> {
    const { usernameOrEmail, password } = signInDto;

    const user = await this.userService.getByUsernameOrEmail(usernameOrEmail);
    if (user != null && (await bcrypt.compare(password, user.password))) {
      const session = await this.sessionService.create();
      return await this.getTokens(user.id, session);
    }
    throw new UnauthorizedException('Invalid login.');
  }

  async refreshTokens(userAndSessionIds: UserAndSessionIds) {
    const { userId, sessionId } = userAndSessionIds;
    const updatedSession = await this.sessionService.update(sessionId);
    return this.getTokens(userId, updatedSession);
  }

  private async validateUsername(
    username: string,
  ): Promise<SignUpValidationResult> {
    if (!Regex.usernameValidation.test(username))
      return SignUpValidationResult.INVALID_FORMAT;
    if (await this.userService.usernameExists(username))
      return SignUpValidationResult.CONFLICT;
    return SignUpValidationResult.SUCCESS;
  }

  private async validateEmail(email: string): Promise<SignUpValidationResult> {
    if (!Regex.emailValidation.test(email))
      return SignUpValidationResult.INVALID_FORMAT;
    if (await this.userService.emailExists(email))
      return SignUpValidationResult.CONFLICT;
    return SignUpValidationResult.SUCCESS;
  }

  async validate(
    validateCredentialsDto: ValidateSignUpDto,
  ): Promise<ValidateSignUpResponseDto> {
    const { username, password, email } = validateCredentialsDto;

    return {
      username:
        username !== undefined
          ? await this.validateUsername(username.toLowerCase().trim())
          : undefined,
      password:
        password !== undefined
          ? Regex.passwordValidation.test(password)
            ? SignUpValidationResult.SUCCESS
            : SignUpValidationResult.INVALID_FORMAT
          : undefined,
      email:
        email !== undefined
          ? await this.validateEmail(email.toLowerCase().trim())
          : undefined,
    };
  }
}
