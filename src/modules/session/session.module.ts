import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSession } from './data/session.entity';
import { SessionRepository } from './data/session.repository';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppSession]), ConfigModule],
  exports: [SessionRepository],
  providers: [SessionService, SessionRepository],
})
export class SessionModule {}
