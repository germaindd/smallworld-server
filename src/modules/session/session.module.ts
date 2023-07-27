import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './data/session.entity';
import { SessionRepository } from './data/session.repository';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity]), ConfigModule],
  exports: [SessionService],
  providers: [SessionService, SessionRepository],
})
export class SessionModule {}
