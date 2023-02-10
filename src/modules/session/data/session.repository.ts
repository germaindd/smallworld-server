import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSession } from './session.entity';

export class SessionRepository {
  constructor(
    @InjectRepository(AppSession) private sessionRepo: Repository<AppSession>,
  ) {}

  async create(tokenId: string, expiry: Date): Promise<AppSession> {
    const session = this.sessionRepo.create({ tokenId, expiry });
    return await this.sessionRepo.save(session);
  }

  async get(id: string): Promise<AppSession | null> {
    return await this.sessionRepo.findOneBy({ id });
  }

  async update(id: string, tokenId: string, expiry: Date): Promise<AppSession> {
    return await this.sessionRepo.save({ id, tokenId, expiry });
  }
}
