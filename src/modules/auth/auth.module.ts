import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token-strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';

@Module({
  controllers: [AuthController],
  imports: [
    SessionModule,
    PassportModule,
    JwtModule.register({}),
    ConfigModule,
    UserModule,
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
