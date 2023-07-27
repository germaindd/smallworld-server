import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { ConfigKeys } from 'src/config/config.schema';
import { v4 as uuid } from 'uuid';
import { SessionEntity } from './data/session.entity';
import { SessionRepository } from './data/session.repository';

@Injectable()
export class SessionService {
  constructor(
    private sessionRespository: SessionRepository,
    private configService: ConfigService,
  ) {}
  private readonly compromisedSessions = new Set<string>();
  private readonly compromisedSessionToExpiry = new Map<string, Date>();

  private readonly logger = new Logger(SessionService.name);

  @Cron(CronExpression.EVERY_12_HOURS)
  clearExpiredCompromisedSessions() {
    let count = 0;
    const currentDate = new Date(Date.now());
    this.compromisedSessionToExpiry.forEach((expiry, session) => {
      if (expiry < currentDate) {
        this.compromisedSessions.delete(session);
        this.compromisedSessionToExpiry.delete(session);
        count++;
      }
    });
    this.logger.log({ message: 'Compromised session cache purged.', count });
  }

  private expiryTimeInMilliseconds =
    this.configService.get(ConfigKeys.REFRESH_TOKEN_EXPIRY_DAYS) *
    1000 *
    60 * // seconds in a minute
    60 * // minutes in an hour
    24; // you get the gist

  private getNewExpiryTimestamp(): Date {
    return new Date(Date.now() + this.expiryTimeInMilliseconds);
  }

  async create(): Promise<SessionEntity> {
    return await this.sessionRespository.create(
      uuid(),
      this.getNewExpiryTimestamp(),
    );
  }

  async get(id: string): Promise<SessionEntity | null> {
    return await this.sessionRespository.get(id);
  }

  async update(id: string): Promise<SessionEntity> {
    return await this.sessionRespository.update(
      id,
      uuid(),
      this.getNewExpiryTimestamp(),
    );
  }

  async delete(id: string): Promise<void> {
    await this.sessionRespository.delete(id);
  }

  isCompromised(id: string): boolean {
    return this.compromisedSessions.has(id);
  }

  setCompromised(id: string, expiry: Date) {
    this.compromisedSessions.add(id);
    this.compromisedSessionToExpiry.set(id, expiry);
  }
}
