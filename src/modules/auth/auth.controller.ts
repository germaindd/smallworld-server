import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt-dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ValidateSignUpResponseDto } from './dto/validate-sign-up-response.dto';
import { ValidateSignUpDto } from './dto/validate-sign-up.dto';
import { GetUser as GetUserAndSessionIds } from './strategies/get-user.decorator';
import { UserAndSessionIds } from './models/user-and-session-ids';
import { RefreshTokenGuard } from './strategies/refresh-token-strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<JwtDto> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto): Promise<JwtDto> {
    return await this.authService.signIn(signInDto);
  }

  @Post('/validate-signup')
  async validate(
    @Body() validateCredentialsDto: ValidateSignUpDto,
  ): Promise<ValidateSignUpResponseDto> {
    return await this.authService.validate(validateCredentialsDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-tokens')
  async refreshTokens(
    @GetUserAndSessionIds() userAndSessionIds: UserAndSessionIds,
  ): Promise<JwtDto> {
    return await this.authService.refreshTokens(userAndSessionIds);
  }
}
