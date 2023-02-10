import { Injectable } from '@nestjs/common';
import { AppSession } from './data/session.entity';
import { SessionRepository } from './data/session.repository';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from 'src/config/config.schema';

@Injectable()
export class SessionService {
  constructor(
    private sessionRespository: SessionRepository,
    private configService: ConfigService,
  ) {}

  private expiryTimeInMilliseconds =
    this.configService.get(ConfigKeys.REFRESH_TOKEN_EXPIRY_DAYS) *
    1000 *
    60 * // seconds in a minute
    60 * // minutes in an hour
    24; // you get the gist

  private getNewExpiryTimestamp(): Date {
    return new Date(Date.now() + this.expiryTimeInMilliseconds);
  }

  async create(): Promise<AppSession> {
    return await this.sessionRespository.create(
      uuid(),
      this.getNewExpiryTimestamp(),
    );
  }

  async get(id: string): Promise<AppSession | null> {
    return await this.sessionRespository.get(id);
  }

  async update(id: string): Promise<AppSession> {
    return await this.sessionRespository.update(
      id,
      uuid(),
      this.getNewExpiryTimestamp(),
    );
  }
}
