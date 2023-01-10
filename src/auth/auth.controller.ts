import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt-dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<JwtDto> {
    return this.authService.signUp(signUpDto);
  }
}
