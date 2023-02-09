import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSession } from './session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectRepository(AppSession) private sessionRepo: Repository<AppSession>,
  ) {}
}
