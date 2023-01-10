import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigKeys } from 'src/config.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entity/user.entity';
import { LocalStrategy } from './local-strategy';
import { UserRepository } from './user.repository';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
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
  ],
  providers: [AuthService, LocalStrategy, UserRepository],
})
export class AuthModule {}
