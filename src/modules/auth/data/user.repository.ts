import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async exist(options?: FindManyOptions<User>): Promise<boolean> {
    return this.userRepo.exist(options);
  }

  async addUser(
    username: string,
    password: string,
    email: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({
      username,
      password: hashedPassword,
      email,
    });

    return await this.userRepo.save(user);
  }
}
