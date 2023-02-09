import { IsString, Matches } from 'class-validator';
import * as Regex from '../constants/regex';

export class SignInDto {
  @IsString()
  @Matches(Regex.emailOrUsernameValidation, {
    message: 'Invalid username/email format',
  })
  usernameOrEmail!: string;
  @IsString()
  password!: string;
}
