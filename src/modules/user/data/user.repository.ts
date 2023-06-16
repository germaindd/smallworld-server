import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async exist(options?: FindManyOptions<User>): Promise<boolean> {
    return this.userRepo.exist(options);
  }

  async findOneBy(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User | null> {
    return await this.userRepo.findOneBy(where);
  }

  async find(options?: FindManyOptions<User>): Promise<User[]> {
    return this.userRepo.find(options);
  }

  async findBy(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ): Promise<User[]> {
    return this.userRepo.findBy(where);
  }

  async addUser(
    username: string,
    password: string,
    email: string,
  ): Promise<User> {
    return await this.userRepo.save({
      username,
      password,
      email,
    });
  }

  async update(user: User) {
    await this.userRepo.update(user.id, user);
  }
}
