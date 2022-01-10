import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { User } from '../../../entities/user.entity';

describe('UsersService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findAll', () => {
    it('모든 프로모션 유저를 반환', async () => {
      const existingUserList = [
        User.of({
          idx: faker.datatype.number(),
          userId: faker.datatype.string(),
          userName: faker.datatype.string(),
        }),
        User.of({
          idx: faker.datatype.number(),
          userId: faker.datatype.string(),
          userName: faker.datatype.string(),
        }),
      ];

      const userRepositoryFindSpy = jest
        .spyOn(userRepository, 'findAll')
        .mockResolvedValue(existingUserList)

      const result = await userService.findAll();

      expect(userRepositoryFindSpy).toBeCalled();
      expect(result).toBe(existingUserList);
    });
  });
  
});
