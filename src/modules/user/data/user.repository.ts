import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async exist(options?: FindManyOptions<UserEntity>): Promise<boolean> {
    return this.userRepo.exist(options);
  }

  async findOneBy(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity | null> {
    return await this.userRepo.findOneBy(where);
  }

  async find(options?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userRepo.find(options);
  }

  async findBy(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity[]> {
    return this.userRepo.findBy(where);
  }

  async addUser(
    username: string,
    password: string,
    email: string,
  ): Promise<UserEntity> {
    return await this.userRepo.save({
      username,
      password,
      email,
    });
  }

  async update(user: UserEntity) {
    await this.userRepo.update(user.id, user);
  }
}
