import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import * as faker from 'faker';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';

describe('UsersController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserRepository],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getAll', () => {
    it('should return all', async () => {
      const userList = [
        User.of({
          idx: faker.datatype.string(),
          userId: faker.datatype.string(),
          userName: faker.datatype.string(),
        }),
        User.of({
          idx: faker.datatype.string(),
          userId: faker.datatype.string(),
          userName: faker.datatype.string(),
        }),
      ];

      const userServiceFindSpy = jest
        .spyOn(userService, 'findAll')
        .mockResolvedValue(userList)

      const result = await userController.getAll();
      expect(userServiceFindSpy).toBeCalled();
      expect(result).toBe(userList);
    });
  })
});
