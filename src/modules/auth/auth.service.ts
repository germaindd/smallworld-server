import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Regex from 'src/modules/auth/constants/regex';
import { User } from './data/user.entity';
import { UserRepository } from './data/user.repository';
import { JwtDto } from './dto/jwt-dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { ValidateSignUpResponseDto } from './dto/validate-sign-up-response.dto';
import { ValidateSignUpDto } from './dto/validate-sign-up.dto';
import { AccessTokenPayload } from './models/token-payload';
import { SignUpValidationResult } from './models/sign-up-validation-result';
import { SessionService } from '../session/session.service';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from 'src/config/config.schema';
import { RefreshTokenPayload } from './models/refresh-token-payload';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private sessionService: SessionService,
    private configService: ConfigService,
  ) {}

  private readonly accessTokenSecret = this.configService.get(
    ConfigKeys.ACCESS_TOKEN_SECRET,
  );
  private readonly refreshTokenSecret = this.configService.get(
    ConfigKeys.REFRESH_TOKEN_SECRET,
  );
  private readonly accessTokenLifespanSeconds =
    this.configService.get(ConfigKeys.ACCESS_TOKEN_EXPIRY_MINUTES) * 60;

  private async getNewTokens(user: User): Promise<JwtDto> {
    const session = await this.sessionService.create();
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      username: user.username,
      sessionid: session.id,
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      ...accessTokenPayload,
      jti: session.tokenId,
      exp: Math.round(session.expiry.getTime() / 1000), // iat format for jwt's is *seconds* since epoch hence the conversion
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
    const { username, password, email } = signUpDto;
    const formattedUsername = username.toLowerCase().trim();
    const formattedEmail = email.toLowerCase().trim();

    let user: User;

    try {
      user = await this.userRepository.addUser(
        formattedUsername,
        password,
        formattedEmail,
      );
    } catch (error: any) {
      if (
        await this.userRepository.exist({
          where: { username: formattedUsername },
        })
      )
        throw new ConflictException('Username already exists');
      if (await this.userRepository.exist({ where: { email: formattedEmail } }))
        throw new ConflictException('User with that email already exists');
      throw new InternalServerErrorException();
    }

    return this.getNewTokens(user);
  }

  async signIn(signInDto: SignInDto): Promise<JwtDto> {
    const { usernameOrEmail, password } = signInDto;
    const formattedUsernameOrEmail = usernameOrEmail.toLowerCase().trim();

    let query: Partial<User>;
    if (Regex.emailValidation.test(usernameOrEmail)) {
      query = { email: formattedUsernameOrEmail };
    } else if (Regex.usernameValidation.test(usernameOrEmail)) {
      query = { username: formattedUsernameOrEmail };
      // field has already been validated through the built in validation pipe which checks
      // that it is either a valid username or password so this exception will never be thrown
    } else throw new InternalServerErrorException();

    const user = await this.userRepository.findOneBy(query);
    if (user != null && (await bcrypt.compare(password, user.password))) {
      return await this.getNewTokens(user);
    }
    throw new UnauthorizedException('Invalid login.');
  }

  private async validateUsername(
    username: string,
  ): Promise<SignUpValidationResult> {
    if (!Regex.usernameValidation.test(username))
      return SignUpValidationResult.INVALID_FORMAT;
    if (await this.userRepository.exist({ where: { username: username } }))
      return SignUpValidationResult.CONFLICT;
    return SignUpValidationResult.SUCCESS;
  }

  private async validateEmail(email: string): Promise<SignUpValidationResult> {
    if (!Regex.emailValidation.test(email))
      return SignUpValidationResult.INVALID_FORMAT;
    if (await this.userRepository.exist({ where: { email: email } }))
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
