import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { ConfigKeys, configValidationSchema } from './config/config.schema';
import { Stages } from './config/stages.enum';
import { AuthModule } from './modules/auth/auth.module';
import { FriendsModule } from './modules/friends/friends.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SearchModule } from './modules/search/search.module';
import { SessionModule } from './modules/session/session.module';
import { UserModule } from './modules/user/user.module';
import { LocationModule } from './modules/location/location.module';

@Module({
  imports: [
    AuthModule,
    SessionModule,
    SearchModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const stage = configService.get(ConfigKeys.STAGE);
        switch (stage) {
          case Stages.DEV:
          case Stages.LOCAL: {
            return {
              pinoHttp: {
                transport: { target: 'pino-pretty' },
                level: 'trace',
              },
            };
          }
          case Stages.PROD: {
            return {
              pinoHttp: {
                level: 'info',
              },
            };
          }
          default: {
            throw new Error(`Invalid env var STAGE: ${stage}`);
          }
        }
      },
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const stage = configService.get(ConfigKeys.STAGE);

        switch (stage) {
          case Stages.LOCAL: {
            return {
              type: 'postgres',
              autoLoadEntities: true,
              synchronize: true,
              host: configService.get(ConfigKeys.DB_HOST),
              port: configService.get(ConfigKeys.DB_PORT),
              username: configService.get(ConfigKeys.DB_USERNAME),
              password: configService.get(ConfigKeys.DB_PASSWORD),
              database: configService.get(ConfigKeys.DB_DATABASE),
            };
          }
          case Stages.DEV: {
            return {
              ssl: true,
              extra: {
                ssl: { rejectUnauthorized: false },
              },
              type: 'postgres',
              autoLoadEntities: true,
              synchronize: true,
              url: configService.get(ConfigKeys.DATABASE_URL),
            };
          }
          case Stages.PROD: {
            throw Error('Prod database not yet configured');
          }
          default: {
            throw new Error(`Invalid env var STAGE: ${stage}`);
          }
        }
      },
    }),
    ScheduleModule.forRoot(),
    FriendsModule,
    ProfileModule,
    UserModule,
    LocationModule,
  ],
})
export class AppModule {}
