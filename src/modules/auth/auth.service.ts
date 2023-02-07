import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Regex } from 'src/constants/regex';
import { User } from './data/user.entity';
import { UserRepository } from './data/user.repository';
import { JwtDto } from './dto/jwt-dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ValidateSignUpResponseDto } from './dto/validate-sign-up-response.dto';
import { ValidateSignUpDto } from './dto/validate-sign-up.dto';
import { JwtPayload } from './types/jwt-payload';
import { SignUpValidationResult } from './types/sign-up-validation-result';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<JwtDto> {
    const { username, password, email } = signUpDto;

    let user: User;

    try {
      user = await this.userRepository.addUser(username, password, email);
    } catch (error: any) {
      if (await this.userRepository.exist({ where: { username } }))
        throw new ConflictException('Username already exists');
      if (await this.userRepository.exist({ where: { email } }))
        throw new ConflictException('User with that email already exists');
      throw new InternalServerErrorException();
    }

    const jwtPayload: JwtPayload = { sub: user.id, username };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return { accessToken };
  }

  private async validateUsername(
    username: string,
  ): Promise<SignUpValidationResult> {
    if (!Regex.usernameValidation.test(username))
      return SignUpValidationResult.INVALID_FORMAT;
    if (await this.userRepository.exist({ where: { username } }))
      return SignUpValidationResult.CONFLICT;
    return SignUpValidationResult.SUCCESS;
  }

  private async validateEmail(email: string): Promise<SignUpValidationResult> {
    if (!Regex.passwordValidation.test(email))
      return SignUpValidationResult.INVALID_FORMAT;
    if (await this.userRepository.exist({ where: { email } }))
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
          ? await this.validateUsername(username)
          : undefined,
      password:
        password !== undefined
          ? Regex.passwordValidation.test(password)
            ? SignUpValidationResult.SUCCESS
            : SignUpValidationResult.INVALID_FORMAT
          : undefined,
      email: email !== undefined ? await this.validateEmail(email) : undefined,
    };
  }
}
