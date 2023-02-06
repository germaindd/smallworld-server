import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Regex } from 'src/constants/regex';
import { JwtDto } from './dto/jwt-dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ValidateSignUpResponseDto } from './dto/validate-sign-up-response.dto';
import { ValidateSignUpDto } from './dto/validate-sign-up.dto';
import { JwtPayload } from './jwt-payload';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<JwtDto> {
    const { username, password } = signUpDto;

    const user = await this.userRepository.addUser(username, password);

    const jwtPayload: JwtPayload = { sub: user.id, username };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return { accessToken };
  }

  validate(
    validateCredentialsDto: ValidateSignUpDto,
  ): ValidateSignUpResponseDto {
    const { username, password, email } = validateCredentialsDto;
    return {
      username:
        username !== undefined
          ? Regex.usernameValidation.test(username)
          : undefined,
      password:
        password !== undefined
          ? Regex.passwordValidation.test(password)
          : undefined,
      email:
        email !== undefined ? Regex.emailValidation.test(email) : undefined,
    };
  }
}
