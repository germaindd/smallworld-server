import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from './session.entity';

export class SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepo: Repository<SessionEntity>,
  ) {}

  async create(tokenId: string, expiry: Date): Promise<SessionEntity> {
    const session = this.sessionRepo.create({ tokenId, expiry });
    return await this.sessionRepo.save(session);
  }

  async get(id: string): Promise<SessionEntity | null> {
    return await this.sessionRepo.findOneBy({ id });
  }

  async update(
    id: string,
    tokenId: string,
    expiry: Date,
  ): Promise<SessionEntity> {
    return await this.sessionRepo.save({ id, tokenId, expiry });
  }

  async delete(id: string): Promise<void> {
    await this.sessionRepo.delete(id);
  }
}
