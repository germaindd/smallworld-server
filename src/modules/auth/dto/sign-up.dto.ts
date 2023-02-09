import { IsString, Matches } from 'class-validator';
import * as Regex from 'src/modules/auth/constants/regex';

export class SignUpDto {
  @IsString()
  @Matches(Regex.emailValidation, {
    message: 'Invalid email',
  })
  email!: string;
  @IsString()
  @Matches(Regex.usernameValidation, {
    message: 'Invalid username',
  })
  username!: string;
  @IsString()
  @Matches(Regex.passwordValidation, {
    message:
      'Invalid password. Password must be between 8 and 30 characters and must contain ' +
      '1) at least one uppercase letter 2) at least one lowercase letter and 3) at' +
      'least one number or special character ',
  })
  password!: string;
}
