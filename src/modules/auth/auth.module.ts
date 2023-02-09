import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigKeys } from 'src/config/config.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppSession } from '../session/data/session.entity';
import { User } from './data/user.entity';
import { UserRepository } from './data/user.repository';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, AppSession]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(ConfigKeys.JWT_SECRET),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
