import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt-dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ValidateSignUpResponseDto } from './dto/validate-sign-up-response.dto';
import { ValidateSignUpDto } from './dto/validate-sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<JwtDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/validate-signup')
  async validate(
    @Body() validateCredentialsDto: ValidateSignUpDto,
  ): Promise<ValidateSignUpResponseDto> {
    return this.authService.validate(validateCredentialsDto);
  }
}
