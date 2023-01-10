import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @Matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, {
    message: 'invalid username format'
  })
  username!: string;
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password!: string;
}
