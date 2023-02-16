import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigKeys, configValidationSchema } from './config/config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stages } from './config/stages.enum';
import { LoggerModule } from 'nestjs-pino';
import { SessionModule } from './modules/session/session.module';
import { SearchModule } from './modules/search/search.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FriendsModule } from './modules/friends/friends.module';

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
          case Stages.DEV: {
            return {
              pinoHttp: {
                transport: { target: 'pino-pretty' },
                level: 'trace',
              },
            };
          }
          default: {
            return {
              pinoHttp: {
                level: 'info',
              },
            };
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
        const isProduction =
          configService.get(ConfigKeys.STAGE) === Stages.PROD;
        return {
          ssl: isProduction,
          extra: {
            // TODO review need for this
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: !isProduction,
          host: configService.get(ConfigKeys.DB_HOST),
          port: configService.get(ConfigKeys.DB_PORT),
          username: configService.get(ConfigKeys.DB_USERNAME),
          password: configService.get(ConfigKeys.DB_PASSWORD),
          database: configService.get(ConfigKeys.DB_DATABASE),
        };
      },
    }),
    ScheduleModule.forRoot(),
    FriendsModule,
  ],
})
export class AppModule {}
