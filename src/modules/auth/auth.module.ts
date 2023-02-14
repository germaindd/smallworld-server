import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModule } from '../session/session.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './data/user.entity';
import { UserRepository } from './data/user.repository';
import { AccessTokenStrategy } from './strategies/access-token-strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token-strategy';

@Module({
  controllers: [AuthController],
  imports: [
    SessionModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    ConfigModule,
  ],
  exports: [UserRepository],
  providers: [
    AuthService,
    UserRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
