import { ReceiverService } from '../receiver.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PromotionReceiverInfo } from '../../../../model/entities/promotionReceiverInfo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../model/entities/user.entity';
import { PromotionReceiverInfoRepository } from '../../../../model/repository/promotionReceiverInfo.repository';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  }),
  save: jest.fn(),
  update: jest.fn(),
});

const mockUserRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

describe('ReceiverService', () => {
  let service: ReceiverService;
  let receiverRepository: MockRepository<PromotionReceiverInfo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiverService,
        PromotionReceiverInfoRepository,
        {
          provide: getRepositoryToken(PromotionReceiverInfo),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        }
      ],
    }).compile();

    service = module.get<ReceiverService>(ReceiverService);
    receiverRepository = module.get<MockRepository<PromotionReceiverInfo>>(
      getRepositoryToken(PromotionReceiverInfo),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});