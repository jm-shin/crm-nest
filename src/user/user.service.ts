import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {
  }

  private readonly logger = new Logger(UserService.name);

  async findAll() {
    return await this.userRepository.findAll()
      .then((users) => {
        this.logger.log(`user list: ${JSON.stringify(users)}`);
        return users;
      })
      .catch((error) => {
        this.logger.log(error);
      });
  }
}