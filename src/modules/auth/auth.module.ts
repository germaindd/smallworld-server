import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigKeys } from 'src/config/config.schema';
import { SessionModule } from '../session/session.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './data/user.entity';
import { UserRepository } from './data/user.repository';

@Module({
  controllers: [AuthController],
  imports: [
    SessionModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    ConfigModule,
  ],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
