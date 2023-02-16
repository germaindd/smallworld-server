import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Like } from 'typeorm';
import * as Regex from '../auth/constants/regex';
import { User } from './data/user.entity';
import { UserRepository } from './data/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async add(username: string, password: string, email: string): Promise<User> {
    const formattedUsername = username.toLowerCase().trim();
    const formattedEmail = email.toLowerCase().trim();

    let user: User;

    try {
      user = await this.userRepository.addUser(
        formattedUsername,
        password,
        formattedEmail,
      );
    } catch (error: any) {
      if (
        await this.userRepository.exist({
          where: { username: formattedUsername },
        })
      )
        throw new ConflictException('Username already exists');
      if (await this.userRepository.exist({ where: { email: formattedEmail } }))
        throw new ConflictException('User with that email already exists');
      throw new InternalServerErrorException();
    }

    return user;
  }

  async getByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const formattedUsernameOrEmail = usernameOrEmail.toLowerCase().trim();

    let query: Partial<User>;
    if (Regex.emailValidation.test(usernameOrEmail)) {
      query = { email: formattedUsernameOrEmail };
    } else if (Regex.usernameValidation.test(usernameOrEmail)) {
      query = { username: formattedUsernameOrEmail };
      // field has already been validated through the built in validation pipe which checks
      // that it is either a valid username or password so this exception will never be thrown
    } else throw new InternalServerErrorException();

    return await this.userRepository.findOneBy(query);
  }

  async getById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async usernameExists(username: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { username: username } });
  }

  async emailExists(email: string): Promise<boolean> {
    return await this.userRepository.exist({ where: { email: email } });
  }

  async searchByUsername(query: string, take: number): Promise<User[]> {
    if (query.trim() === '') return [];
    const users = await this.userRepository.find({
      where: {
        username: Like(`${query.toLowerCase().trim()}%`),
      },
      take: take,
    });
    return users;
  }
}
