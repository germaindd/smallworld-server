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
import { TokenPayload } from '../session/models/token-payload';
import { SignUpValidationResult } from './models/sign-up-validation-result';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

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

    const jwtPayload: TokenPayload = { sub: user.id, username };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return { accessToken };
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
      const jwtPayload: TokenPayload = {
        sub: user.id,
        username: user.username,
      };
      const accessToken = await this.jwtService.signAsync(jwtPayload);
      return { accessToken };
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
